/**
 * PRIME X CAPITAL - HIGH-PERFORMANCE FINANCIAL CHART ENGINE
 * Real-time Candlestick, Line & Technical Indicator Canvas Renderer
 */

(function (global) {
  'use strict';

  class FinancialChart {
    constructor(canvasOrId, options = {}) {
      if (typeof canvasOrId === 'string') {
        this.canvas = document.getElementById(canvasOrId);
      } else {
        this.canvas = canvasOrId;
      }

      if (!this.canvas) {
        console.warn(`[FinancialChart] Canvas element not found: ${canvasOrId}`);
        return;
      }

      this.ctx = this.canvas.getContext('2d');
      this.options = Object.assign({
        upColor: '#00b87c',
        downColor: '#f6465d',
        bgColor: '#ffffff',
        gridColor: '#f1f5f9',
        textColor: '#64748b',
        crosshairColor: 'rgba(15, 23, 42, 0.28)',
        priceAxisWidth: 64,
        timeAxisHeight: 22,
        subPanelHeightRatio: 0.25
      }, options);

      this.candles = [];
      this.chartType = 'candlestick'; // 'candlestick' | 'line' | 'area'
      this.signalOverlay = null;
      
      this.indicators = {
        MA: true,
        EMA: false,
        BOLL: false,
        VOL: true,
        MACD: false,
        KDJ: false,
        RSI: false
      };

      // Mouse & Touch interaction
      this.crosshair = {
        active: false,
        x: 0,
        y: 0,
        candleIndex: -1
      };

      this.width = 0;
      this.height = 0;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.setupResize();
      this.setupEvents();
    }

    setupResize() {
      if (!this.canvas) return;
      this.resize();

      if (window.ResizeObserver) {
        this.resizeObserver = new ResizeObserver(() => {
          this.resize();
          this.render();
        });
        const parent = this.canvas.parentElement || this.canvas;
        this.resizeObserver.observe(parent);
      } else {
        window.addEventListener('resize', () => {
          this.resize();
          this.render();
        });
      }
    }

    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const parent = this.canvas.parentElement;
      const w = Math.max(200, rect.width || (parent ? parent.clientWidth : 0) || 600);
      const h = Math.max(160, rect.height || (parent ? parent.clientHeight : 0) || 260);

      this.width = w;
      this.height = h;

      const targetW = Math.floor(this.width * this.dpr);
      const targetH = Math.floor(this.height * this.dpr);
      if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
        this.canvas.width = targetW;
        this.canvas.height = targetH;
      }
    }

    normalizeCandles(candles) {
      if (!Array.isArray(candles)) return [];
      const out = [];
      for (let i = 0; i < candles.length; i++) {
        const raw = candles[i];
        if (!raw) continue;
        let time, open, high, low, close, volume;
        if (Array.isArray(raw)) {
          time = Number(raw[0]);
          open = Number(raw[1]);
          high = Number(raw[2]);
          low = Number(raw[3]);
          close = Number(raw[4]);
          volume = Number(raw[5] ?? 0);
        } else if (typeof raw === 'object') {
          time = Number(raw.time ?? raw.t ?? raw.timestamp ?? 0);
          open = Number(raw.open ?? raw.o);
          high = Number(raw.high ?? raw.h);
          low = Number(raw.low ?? raw.l);
          close = Number(raw.close ?? raw.c);
          volume = Number(raw.volume ?? raw.v ?? raw.vol ?? 0);
        } else {
          continue;
        }
        if (!Number.isFinite(open) || !Number.isFinite(close) || open <= 0 || close <= 0) continue;
        if (!Number.isFinite(high)) high = Math.max(open, close);
        if (!Number.isFinite(low)) low = Math.min(open, close);
        high = Math.max(high, open, close);
        low = Math.min(low, open, close);
        if (time > 1e12) time = Math.floor(time / 1000);
        if (!Number.isFinite(time) || time <= 0) {
          time = Math.floor(Date.now() / 1000) - (candles.length - i) * 300;
        }
        out.push({
          time,
          open,
          high,
          low,
          close,
          volume: Number.isFinite(volume) && volume >= 0 ? volume : 0
        });
      }
      return out;
    }

    formatAxisPrice(p) {
      const num = Number(p);
      if (!Number.isFinite(num)) return '0.00';
      const abs = Math.abs(num);
      if (abs >= 1000) return num.toFixed(2);
      if (abs >= 1) return num.toFixed(4);
      if (abs >= 0.01) return num.toFixed(5);
      return num.toFixed(6);
    }

    generateSeedCandles(basePrice = 77500) {
      const safeBase = (Number.isFinite(Number(basePrice)) && Number(basePrice) > 0) ? Number(basePrice) : 77500;
      const decimals = safeBase >= 1000 ? 2 : (safeBase >= 1 ? 4 : (safeBase >= 0.01 ? 5 : 6));
      const minFloor = safeBase * 0.1;
      const candles = [];
      let price = safeBase;
      const now = Math.floor(Date.now() / 1000);
      for (let i = 45; i >= 0; i--) {
        const time = now - i * 300;
        const trend = Math.sin(i * 0.35) * 0.007;
        const noise = (Math.random() - 0.48) * 0.012;
        const delta = (trend + noise) * price;
        const open = price;
        const close = Math.max(minFloor, price + delta);
        const high = Math.max(open, close) + Math.random() * 0.004 * price;
        const low = Math.max(minFloor, Math.min(open, close) - Math.random() * 0.004 * price);
        const volume = Math.floor(120000 + Math.random() * 650000);
        candles.push({
          time,
          open: Number(open.toFixed(decimals)),
          high: Number(high.toFixed(decimals)),
          low: Number(low.toFixed(decimals)),
          close: Number(close.toFixed(decimals)),
          volume
        });
        price = close;
      }
      return candles;
    }

    setupEvents() {
      if (!this.canvas) return;

      const onMove = (clientX, clientY) => {
        const rect = this.canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        if (x >= 0 && x <= this.width && y >= 0 && y <= this.height) {
          this.crosshair.active = true;
          this.crosshair.x = x;
          this.crosshair.y = y;
          this.render();
        } else {
          this.crosshair.active = false;
          this.render();
        }
      };

      this.canvas.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
      this.canvas.addEventListener('mouseleave', () => {
        this.crosshair.active = false;
        this.render();
      });

      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          onMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      this.canvas.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          onMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      this.canvas.addEventListener('touchend', () => {
        setTimeout(() => {
          this.crosshair.active = false;
          this.render();
        }, 1500);
      });
    }

    setData(candles, chartType) {
      this.candles = this.normalizeCandles(candles);
      if (chartType) {
        this.chartType = (chartType === 'candles') ? 'candlestick' : chartType;
      }
      this.computeTechnicalIndicators();
      this.render();
    }

    setChartType(type) {
      this.chartType = (type === 'candles') ? 'candlestick' : type;
      this.render();
    }

    setSignalOverlay(overlay) {
      this.signalOverlay = overlay || null;
      this.render();
    }

    updateLiveCandleTick(nextPrice, volDelta = 0, stepSeconds = 60) {
      const price = Number(nextPrice);
      if (!Number.isFinite(price) || price <= 0) return;
      if (!this.candles || !this.candles.length) {
        this.candles = this.generateSeedCandles(price);
      }
      const nowSec = Math.floor(Date.now() / 1000);
      const last = this.candles[this.candles.length - 1];
      const decimals = price >= 1000 ? 2 : (price >= 10 ? 2 : (price >= 1 ? 4 : (price >= 0.01 ? 5 : 6)));
      const roundedPrice = Number(price.toFixed(decimals));

      if (last && (nowSec - Number(last.time || 0)) >= stepSeconds) {
        const open = last.close;
        const close = roundedPrice;
        this.candles.push({
          time: nowSec,
          open,
          high: Math.max(open, close),
          low: Math.min(open, close),
          close,
          volume: Math.max(1200, Math.round(volDelta || 4200))
        });
        if (this.candles.length > 90) {
          this.candles.shift();
        }
      } else if (last) {
        last.close = roundedPrice;
        last.high = Math.max(last.high, roundedPrice);
        last.low = Math.min(last.low, roundedPrice);
        last.volume = Math.max(0, Number(last.volume || 0) + Number(volDelta || 180));
      }

      this.computeTechnicalIndicators();
      this.render();
    }

    setColors(newColors = {}) {
      Object.assign(this.options, newColors);
      this.render();
    }

    hexToRgba(hex, alpha) {
      if (!hex || typeof hex !== 'string') return `rgba(0, 82, 255, ${alpha})`;
      if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
      const clean = hex.replace('#', '');
      const full = clean.length === 3
        ? clean.split('').map(c => c + c).join('')
        : clean;
      const num = parseInt(full, 16);
      if (Number.isNaN(num)) return `rgba(0, 82, 255, ${alpha})`;
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    toggleIndicator(name, forceState) {
      const key = name.toUpperCase();
      if (this.indicators.hasOwnProperty(key)) {
        if (typeof forceState === 'boolean') {
          this.indicators[key] = forceState;
        } else {
          this.indicators[key] = !this.indicators[key];
        }
        this.computeTechnicalIndicators();
        this.render();
        return this.indicators[key];
      }
      return false;
    }

    computeTechnicalIndicators() {
      const len = this.candles.length;
      if (len === 0) return;

      const closes = this.candles.map(c => Number(c.close));

      // 1. Moving Averages (MA7, MA25, MA99)
      const calcMA = (period) => {
        const ma = new Array(len).fill(null);
        let sum = 0;
        for (let i = 0; i < len; i++) {
          sum += closes[i];
          if (i >= period) {
            sum -= closes[i - period];
          }
          if (i >= period - 1) {
            ma[i] = sum / period;
          }
        }
        return ma;
      };

      this.ma7 = calcMA(7);
      this.ma25 = calcMA(25);
      this.ma99 = calcMA(99);

      // 2. Exponential Moving Averages (EMA12, EMA26)
      const calcEMA = (period) => {
        const ema = new Array(len).fill(null);
        if (len < period) return ema;
        const k = 2 / (period + 1);
        let prev = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;
        ema[period - 1] = prev;
        for (let i = period; i < len; i++) {
          prev = closes[i] * k + prev * (1 - k);
          ema[i] = prev;
        }
        return ema;
      };

      this.ema12 = calcEMA(12);
      this.ema26 = calcEMA(26);

      // 3. Bollinger Bands (20 periods, 2 standard deviations)
      this.bollUpper = new Array(len).fill(null);
      this.bollMid = new Array(len).fill(null);
      this.bollLower = new Array(len).fill(null);
      for (let i = 19; i < len; i++) {
        const slice = closes.slice(i - 19, i + 1);
        const mean = slice.reduce((a, b) => a + b, 0) / 20;
        const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / 20;
        const stdDev = Math.sqrt(variance);
        this.bollMid[i] = mean;
        this.bollUpper[i] = mean + 2 * stdDev;
        this.bollLower[i] = mean - 2 * stdDev;
      }

      // 4. MACD (12, 26, 9)
      this.macdLine = new Array(len).fill(null);
      this.macdSignal = new Array(len).fill(null);
      this.macdHist = new Array(len).fill(null);
      if (len >= 26) {
        for (let i = 25; i < len; i++) {
          if (this.ema12[i] !== null && this.ema26[i] !== null) {
            this.macdLine[i] = this.ema12[i] - this.ema26[i];
          }
        }
        // Signal line = 9 EMA of MACD
        const validMacd = this.macdLine.slice(25);
        if (validMacd.length >= 9) {
          const k = 2 / (9 + 1);
          let prevSig = validMacd.slice(0, 9).reduce((a, b) => a + b, 0) / 9;
          this.macdSignal[25 + 8] = prevSig;
          this.macdHist[25 + 8] = (this.macdLine[25 + 8] - prevSig) * 2;
          for (let i = 25 + 9; i < len; i++) {
            prevSig = this.macdLine[i] * k + prevSig * (1 - k);
            this.macdSignal[i] = prevSig;
            this.macdHist[i] = (this.macdLine[i] - prevSig) * 2;
          }
        }
      }

      // 5. RSI (14 period)
      this.rsi14 = new Array(len).fill(null);
      if (len > 14) {
        let gains = 0;
        let losses = 0;
        for (let i = 1; i <= 14; i++) {
          const diff = closes[i] - closes[i - 1];
          if (diff >= 0) gains += diff;
          else losses += Math.abs(diff);
        }
        let avgGain = gains / 14;
        let avgLoss = losses / 14;
        let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        this.rsi14[14] = 100 - (100 / (1 + rs));

        for (let i = 15; i < len; i++) {
          const diff = closes[i] - closes[i - 1];
          const curGain = diff > 0 ? diff : 0;
          const curLoss = diff < 0 ? Math.abs(diff) : 0;
          avgGain = (avgGain * 13 + curGain) / 14;
          avgLoss = (avgLoss * 13 + curLoss) / 14;
          rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
          this.rsi14[i] = 100 - (100 / (1 + rs));
        }
      }
    }

    render() {
      if (!this.canvas || !this.ctx) return;
      this.resize();
      const ctx = this.ctx;

      ctx.save();
      ctx.scale(this.dpr, this.dpr);

      // Background
      ctx.fillStyle = this.options.bgColor;
      ctx.fillRect(0, 0, this.width, this.height);

      if (!this.candles || this.candles.length === 0) {
        this.candles = this.generateSeedCandles();
        this.computeTechnicalIndicators();
      }

      // Chart Layout Geometry
      const priceAxisW = this.options.priceAxisWidth;
      const timeAxisH = this.options.timeAxisHeight;
      const plotW = this.width - priceAxisW;
      
      const hasSubPanel = this.indicators.VOL || this.indicators.MACD || this.indicators.RSI;
      const subPanelH = hasSubPanel ? Math.floor(this.height * this.options.subPanelHeightRatio) : 0;
      const mainPlotH = this.height - timeAxisH - (hasSubPanel ? subPanelH + 6 : 0);
      const subPlotY = mainPlotH + 6;

      // Visible candle window (last 60 candles or all available)
      const maxVisible = Math.min(this.candles.length, Math.floor(plotW / 7));
      const visibleCandles = this.candles.slice(-maxVisible);
      const visibleCount = visibleCandles.length;
      const candleSlotW = plotW / visibleCount;
      const barW = Math.max(2, Math.floor(candleSlotW * 0.72));

      // Calculate Price Bounds
      let minPrice = Infinity;
      let maxPrice = -Infinity;
      let maxVol = 0;

      for (let i = 0; i < visibleCount; i++) {
        const c = visibleCandles[i];
        if (c.high > maxPrice) maxPrice = c.high;
        if (c.low < minPrice) minPrice = c.low;
        if (c.volume && c.volume > maxVol) maxVol = c.volume;
      }

      // Include visible indicators in price bounds
      const startIndex = this.candles.length - visibleCount;
      if (this.indicators.MA) {
        for (let i = 0; i < visibleCount; i++) {
          const idx = startIndex + i;
          if (this.ma7[idx]) { minPrice = Math.min(minPrice, this.ma7[idx]); maxPrice = Math.max(maxPrice, this.ma7[idx]); }
          if (this.ma25[idx]) { minPrice = Math.min(minPrice, this.ma25[idx]); maxPrice = Math.max(maxPrice, this.ma25[idx]); }
        }
      }
      if (this.indicators.BOLL) {
        for (let i = 0; i < visibleCount; i++) {
          const idx = startIndex + i;
          if (this.bollUpper[idx]) maxPrice = Math.max(maxPrice, this.bollUpper[idx]);
          if (this.bollLower[idx]) minPrice = Math.min(minPrice, this.bollLower[idx]);
        }
      }

      if (this.signalOverlay) {
        const ov = this.signalOverlay;
        [ov.entry, ov.tp1, ov.tp2, ov.sl].forEach(lvl => {
          const v = Number(lvl);
          if (Number.isFinite(v) && v > 0) {
            minPrice = Math.min(minPrice, v);
            maxPrice = Math.max(maxPrice, v);
          }
        });
      }

      // Padding for top/bottom margins
      if (!Number.isFinite(minPrice) || !Number.isFinite(maxPrice)) {
        return ctx.restore();
      }
      const rawRange = maxPrice - minPrice;
      const safeSpan = rawRange > 0 ? rawRange : Math.max(Math.abs(maxPrice) * 0.02, 0.0001);
      const padding = safeSpan * 0.06;
      minPrice -= padding;
      maxPrice += padding;
      const paddedRange = (maxPrice - minPrice) || 1;

      const priceToY = (price) => {
        return mainPlotH - ((price - minPrice) / paddedRange) * mainPlotH;
      };

      const xForIndex = (i) => {
        return i * candleSlotW + candleSlotW / 2;
      };

      // 1. Grid Lines & Price Axis Labels
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.options.gridColor;
      ctx.fillStyle = this.options.textColor;
      ctx.font = '10px var(--font-mono, monospace)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const gridSteps = 4;
      for (let s = 0; s <= gridSteps; s++) {
        const p = minPrice + (paddedRange / gridSteps) * s;
        const y = Math.round(priceToY(p));

        // Horizontal Grid Line
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(plotW, y);
        ctx.stroke();

        // Right Price Label
        ctx.fillText(this.formatAxisPrice(p), this.width - 4, y);
      }

      // 2. Draw Candlesticks or Line/Area
      if (this.chartType === 'line' || this.chartType === 'area') {
        // Area Gradient
        ctx.beginPath();
        ctx.moveTo(xForIndex(0), priceToY(visibleCandles[0].close));
        for (let i = 1; i < visibleCount; i++) {
          ctx.lineTo(xForIndex(i), priceToY(visibleCandles[i].close));
        }

        if (this.chartType === 'area') {
          const lastX = xForIndex(visibleCount - 1);
          ctx.lineTo(lastX, mainPlotH);
          ctx.lineTo(xForIndex(0), mainPlotH);
          ctx.closePath();

          const grad = ctx.createLinearGradient(0, 0, 0, mainPlotH);
          grad.addColorStop(0, this.hexToRgba(this.options.upColor, 0.22));
          grad.addColorStop(1, this.hexToRgba(this.options.upColor, 0.01));
          ctx.fillStyle = grad;
          ctx.fill();

          // Stroke line
          ctx.beginPath();
          ctx.moveTo(xForIndex(0), priceToY(visibleCandles[0].close));
          for (let i = 1; i < visibleCount; i++) {
            ctx.lineTo(xForIndex(i), priceToY(visibleCandles[i].close));
          }
        }

        ctx.strokeStyle = this.options.upColor;
        ctx.lineWidth = 2;
        ctx.stroke();

      } else {
        // Candlesticks
        for (let i = 0; i < visibleCount; i++) {
          const c = visibleCandles[i];
          const x = xForIndex(i);
          const isUp = c.close >= c.open;
          const color = isUp ? this.options.upColor : this.options.downColor;

          const openY = priceToY(c.open);
          const closeY = priceToY(c.close);
          const highY = priceToY(c.high);
          const lowY = priceToY(c.low);

          const bodyTop = Math.min(openY, closeY);
          const bodyBottom = Math.max(openY, closeY);
          const bodyHeight = Math.max(1, bodyBottom - bodyTop);

          // Wick
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(Math.round(x), Math.round(highY));
          ctx.lineTo(Math.round(x), Math.round(lowY));
          ctx.stroke();

          // Body
          ctx.fillStyle = color;
          ctx.fillRect(
            Math.round(x - barW / 2),
            Math.round(bodyTop),
            barW,
            bodyHeight
          );
        }
      }

      // 3. Technical Indicator Overlays on Main Chart
      // MA (7, 25, 99)
      if (this.indicators.MA) {
        const drawIndicatorLine = (dataArr, strokeColor) => {
          ctx.beginPath();
          let started = false;
          for (let i = 0; i < visibleCount; i++) {
            const val = dataArr[startIndex + i];
            if (val !== null && val !== undefined) {
              const x = xForIndex(i);
              const y = priceToY(val);
              if (!started) {
                ctx.moveTo(x, y);
                started = true;
              } else {
                ctx.lineTo(x, y);
              }
            }
          }
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        };

        drawIndicatorLine(this.ma7, '#f59e0b');   // Yellow/Amber
        drawIndicatorLine(this.ma25, '#8b5cf6');  // Violet
        drawIndicatorLine(this.ma99, '#06b6d4');  // Cyan
      }

      // EMA (12, 26)
      if (this.indicators.EMA) {
        const drawEma = (arr, color) => {
          ctx.beginPath();
          let started = false;
          for (let i = 0; i < visibleCount; i++) {
            const val = arr[startIndex + i];
            if (val !== null) {
              const x = xForIndex(i);
              const y = priceToY(val);
              if (!started) { ctx.moveTo(x, y); started = true; }
              else { ctx.lineTo(x, y); }
            }
          }
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        };
        drawEma(this.ema12, '#3b82f6');
        drawEma(this.ema26, '#ec4899');
      }

      // BOLL (Upper, Mid, Lower)
      if (this.indicators.BOLL) {
        const drawBoll = (arr, color, dash = []) => {
          ctx.save();
          ctx.setLineDash(dash);
          ctx.beginPath();
          let started = false;
          for (let i = 0; i < visibleCount; i++) {
            const val = arr[startIndex + i];
            if (val !== null) {
              const x = xForIndex(i);
              const y = priceToY(val);
              if (!started) { ctx.moveTo(x, y); started = true; }
              else { ctx.lineTo(x, y); }
            }
          }
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        };
        drawBoll(this.bollUpper, 'rgba(6, 182, 212, 0.7)');
        drawBoll(this.bollMid, 'rgba(245, 158, 11, 0.7)', [3, 3]);
        drawBoll(this.bollLower, 'rgba(6, 182, 212, 0.7)');
      }

      // 3b. Signal Entry / TP1 / TP2 / SL Overlay Lines
      if (this.signalOverlay) {
        const ov = this.signalOverlay;
        const drawLevelLine = (val, labelText, color, dash = [4, 4]) => {
          const num = Number(val);
          if (!Number.isFinite(num) || num <= 0) return;
          const y = Math.round(priceToY(num));
          if (y < 6 || y > mainPlotH - 6) return;

          ctx.save();
          ctx.setLineDash(dash);
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.15;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(plotW, y);
          ctx.stroke();
          ctx.restore();

          const tagText = `${labelText} ${this.formatAxisPrice(num)}`;
          ctx.save();
          ctx.font = 'bold 9.5px var(--font-mono, monospace)';
          const textW = ctx.measureText(tagText).width + 10;
          ctx.fillStyle = color;
          ctx.fillRect(6, y - 8, textW, 16);
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(tagText, 11, y);
          ctx.restore();
        };

        drawLevelLine(ov.entry, 'ENTRY', '#0052FF', [5, 3]);
        drawLevelLine(ov.tp1, 'TP1', '#00B87C', [4, 4]);
        drawLevelLine(ov.tp2, 'TP2', '#059669', [2, 3]);
        drawLevelLine(ov.sl, 'SL', '#F6465D', [4, 4]);
      }

      // 4. Latest Price Tracker Line & Badge
      const lastCandle = visibleCandles[visibleCount - 1];
      if (lastCandle) {
        const lastY = priceToY(lastCandle.close);
        const isUp = lastCandle.close >= lastCandle.open;
        const color = isUp ? this.options.upColor : this.options.downColor;

        // Dashed line across plot
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, lastY);
        ctx.lineTo(plotW, lastY);
        ctx.stroke();
        ctx.restore();

        // Right axis badge
        ctx.fillStyle = color;
        const badgeH = 16;
        ctx.fillRect(plotW, Math.round(lastY - badgeH / 2), priceAxisW, badgeH);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px var(--font-mono, monospace)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.formatAxisPrice(lastCandle.close), plotW + priceAxisW / 2, lastY);
      }

      // 5. Sub-Panel (Volume, MACD, or RSI)
      if (hasSubPanel) {
        // Divider line
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, subPlotY - 3);
        ctx.lineTo(this.width, subPlotY - 3);
        ctx.stroke();

        if (this.indicators.VOL) {
          // Volume Bars
          const volMax = maxVol || 1;
          for (let i = 0; i < visibleCount; i++) {
            const c = visibleCandles[i];
            const x = xForIndex(i);
            const isUp = c.close >= c.open;
            const barH = ((c.volume || 0) / volMax) * (subPanelH - 4);
            ctx.fillStyle = this.hexToRgba(isUp ? this.options.upColor : this.options.downColor, 0.72);
            ctx.fillRect(
              Math.round(x - barW / 2),
              Math.round(subPlotY + subPanelH - barH),
              barW,
              Math.max(1, barH)
            );
          }

          // Volume label
          ctx.fillStyle = this.options.textColor;
          ctx.font = '9px var(--font-mono, monospace)';
          ctx.textAlign = 'left';
          ctx.fillText(`VOL: ${(lastCandle.volume / 1000).toFixed(1)}k`, 6, subPlotY + 9);
        } else if (this.indicators.RSI) {
          // RSI (14) Curve (30 and 70 lines)
          const rsiY = (v) => subPlotY + subPanelH - (v / 100) * subPanelH;

          // 30 / 70 reference bands
          ctx.save();
          ctx.setLineDash([2, 2]);
          ctx.strokeStyle = 'rgba(15, 23, 42, 0.14)';
          ctx.beginPath();
          ctx.moveTo(0, rsiY(70)); ctx.lineTo(plotW, rsiY(70));
          ctx.moveTo(0, rsiY(30)); ctx.lineTo(plotW, rsiY(30));
          ctx.stroke();
          ctx.restore();

          // RSI curve
          ctx.beginPath();
          let started = false;
          for (let i = 0; i < visibleCount; i++) {
            const val = this.rsi14[startIndex + i];
            if (val !== null) {
              const x = xForIndex(i);
              const y = rsiY(val);
              if (!started) { ctx.moveTo(x, y); started = true; }
              else { ctx.lineTo(x, y); }
            }
          }
          ctx.strokeStyle = '#8b5cf6';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#8b5cf6';
          ctx.font = '9px var(--font-mono, monospace)';
          ctx.textAlign = 'left';
          const curRsi = this.rsi14[this.candles.length - 1] || 50;
          ctx.fillText(`RSI(14): ${curRsi.toFixed(1)}`, 6, subPlotY + 9);
        } else if (this.indicators.MACD) {
          // MACD histogram and lines
          const macdY = (v) => subPlotY + subPanelH / 2 - (v * 12);
          for (let i = 0; i < visibleCount; i++) {
            const h = this.macdHist[startIndex + i] || 0;
            const x = xForIndex(i);
            const isPos = h >= 0;
            ctx.fillStyle = this.hexToRgba(isPos ? this.options.upColor : this.options.downColor, 0.72);
            const barH = Math.abs(h) * 10;
            const topY = isPos ? (subPlotY + subPanelH / 2 - barH) : (subPlotY + subPanelH / 2);
            ctx.fillRect(Math.round(x - barW / 2), Math.round(topY), barW, Math.max(1, barH));
          }

          ctx.fillStyle = '#06b6d4';
          ctx.font = '9px var(--font-mono, monospace)';
          ctx.textAlign = 'left';
          ctx.fillText(`MACD(12,26,9)`, 6, subPlotY + 9);
        }
      }

      // 6. Time Axis Labels at the bottom
      ctx.fillStyle = this.options.textColor;
      ctx.font = '9px var(--font-mono, monospace)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const timeSteps = 4;
      for (let s = 0; s < timeSteps; s++) {
        const idx = Math.floor((visibleCount - 1) * (s / (timeSteps - 1)));
        const candle = visibleCandles[idx];
        if (candle && candle.time) {
          const x = xForIndex(idx);
          const d = new Date(candle.time * 1000);
          const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
          ctx.fillText(timeStr, x, this.height - timeAxisH + 4);
        }
      }

      // 7. Interactive Crosshair & Tooltip
      if (this.crosshair.active && this.crosshair.x < plotW && this.crosshair.y < mainPlotH) {
        const hoveredIdx = Math.min(
          visibleCount - 1,
          Math.max(0, Math.floor(this.crosshair.x / candleSlotW))
        );
        const candle = visibleCandles[hoveredIdx];

        if (candle) {
          const crossX = Math.round(xForIndex(hoveredIdx));
          const crossY = Math.round(this.crosshair.y);

          // Dashed Crosshair Lines
          ctx.save();
          ctx.setLineDash([2, 2]);
          ctx.strokeStyle = this.options.crosshairColor;
          ctx.lineWidth = 1;

          // Vertical line
          ctx.beginPath();
          ctx.moveTo(crossX, 0);
          ctx.lineTo(crossX, this.height - timeAxisH);
          ctx.stroke();

          // Horizontal line
          ctx.beginPath();
          ctx.moveTo(0, crossY);
          ctx.lineTo(plotW, crossY);
          ctx.stroke();
          ctx.restore();

          // Price Tag on Right Axis
          const cursorPrice = maxPrice - (crossY / mainPlotH) * (maxPrice - minPrice);
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(plotW, crossY - 8, priceAxisW, 16);
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px var(--font-mono, monospace)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            this.formatAxisPrice(cursorPrice),
            plotW + priceAxisW / 2,
            crossY
          );

          // Time Tag on Bottom Axis
          const date = new Date(candle.time * 1000);
          const dateStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          const tagW = 44;
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(crossX - tagW / 2, this.height - timeAxisH, tagW, 16);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(dateStr, crossX, this.height - timeAxisH + 8);

          // Top Info Banner with Candle Metrics
          const changePct = (((candle.close - candle.open) / candle.open) * 100).toFixed(2);
          const isUp = candle.close >= candle.open;

          ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
          ctx.fillRect(4, 4, plotW - 8, 18);

          ctx.font = '10px var(--font-mono, monospace)';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';

          ctx.fillStyle = this.options.textColor;
          ctx.fillText(`O: `, 8, 8);
          ctx.fillStyle = isUp ? this.options.upColor : this.options.downColor;
          ctx.fillText(`${candle.open}`, 22, 8);

          ctx.fillStyle = this.options.textColor;
          ctx.fillText(`H: `, 80, 8);
          ctx.fillStyle = isUp ? this.options.upColor : this.options.downColor;
          ctx.fillText(`${candle.high}`, 94, 8);

          ctx.fillStyle = this.options.textColor;
          ctx.fillText(`L: `, 152, 8);
          ctx.fillStyle = isUp ? this.options.upColor : this.options.downColor;
          ctx.fillText(`${candle.low}`, 166, 8);

          ctx.fillStyle = this.options.textColor;
          ctx.fillText(`C: `, 224, 8);
          ctx.fillStyle = isUp ? this.options.upColor : this.options.downColor;
          ctx.fillText(`${candle.close}`, 238, 8);

          ctx.fillStyle = isUp ? this.options.upColor : this.options.downColor;
          ctx.fillText(`${isUp ? '+' : ''}${changePct}%`, 300, 8);
        }
      }

      ctx.restore();
    }

    destroy() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    }
  }

  // Export to global scope
  global.FinancialChart = FinancialChart;
})(typeof window !== 'undefined' ? window : this);
