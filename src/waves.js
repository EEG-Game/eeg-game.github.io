/* -----------------------------
   CANVAS DRAWING
--------------------------------*/
export function drawWaveform(waveform, waveformCanvas, ctx) {
  const width = waveformCanvas.width = waveformCanvas.offsetWidth;
  const height = waveformCanvas.height = waveformCanvas.offsetHeight;

  ctx.clearRect(0,0,width,height);
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 2;

  ctx.beginPath();
  waveform.draw(ctx, width, height);
  ctx.stroke();
}

/* --- existing abnormal renderers from your version --- */
export function drawSpikeAndWave(ctx, width, height) {
  const centerY = height/2, points = 200, spikeInterval = width/3;
  for (let i=0;i<points;i++){
    const x = (i/points)*width;
    const spikePos = Math.floor(x/spikeInterval);
    const rx = x - spikePos*spikeInterval;
    let y;
    if (rx < spikeInterval*0.2) y = centerY - (rx/(spikeInterval*0.2))*40;
    else if (rx < spikeInterval*0.4) y = centerY - 40 + ((rx-spikeInterval*0.2)/(spikeInterval*0.2))*80;
    else y = centerY + 40*Math.sin((rx - spikeInterval*0.4)/(spikeInterval*0.6)*Math.PI*2);
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

export function drawPolyspikeWaves(ctx, width, height) {
  const centerY = height/2, points = 200, waveInterval = width/2;
  for (let i=0;i<points;i++){
    const x = (i/points)*width;
    const wavePos = Math.floor(x/waveInterval);
    const rx = x - wavePos*waveInterval;
    let y;
    if (rx < waveInterval*0.3){
      const spikeCount = 3;
      const sw = waveInterval*0.3/spikeCount;
      const si = Math.floor(rx/sw);
      const srx = rx - si*sw;
      if (srx < sw*0.3) y = centerY - (srx/(sw*0.3))*50;
      else if (srx < sw*0.6) y = centerY - 50 + ((srx - sw*0.3)/(sw*0.3))*100;
      else y = centerY + 50*(srx - sw*0.6)/(sw*0.4);
    } else {
      y = centerY + 40*Math.sin((rx - waveInterval*0.3)/(waveInterval*0.7)*Math.PI*2);
    }
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

export function drawRandomSpikes(ctx, width, height, spikeCount, maxAmp){
  const centerY = height/2, points=200, intv = width/spikeCount;
  for(let i=0;i<points;i++){
    const x=(i/points)*width, pos=Math.floor(x/intv), rx=x-pos*intv;
    let y=centerY + (Math.random()-0.5)*10;
    if (rx<intv*0.2){ const h=maxAmp*(0.5+Math.random()*0.5); y -= (rx/(intv*0.2))*h;}
    else if (rx<intv*0.4){ const h=maxAmp*(0.5+Math.random()*0.5); y -= h - ((rx-intv*0.2)/(intv*0.2))*h*2;}
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

export function drawChaoticPattern(ctx, width, height){
  const centerY = height/2, points=200;
  for (let i=0;i<points;i++){
    const x=(i/points)*width; let y=centerY;
    y += 60*Math.sin(x/width*Math.PI*8);
    if (Math.random()<0.1) y -= 30 + Math.random()*40;
    y += (Math.random()-0.5)*40;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

export function drawSlowSpikeAndWave(ctx, width, height){
  const centerY=height/2, points=200, intv=width/2;
  for(let i=0;i<points;i++){
    const x=(i/points)*width, pos=Math.floor(x/intv), rx=x-pos*intv;
    let y;
    if (rx<intv*0.3) y = centerY - (rx/(intv*0.3))*40;
    else if (rx<intv*0.5) y = centerY - 40 + ((rx-intv*0.3)/(intv*0.2))*80;
    else y = centerY + 40*Math.sin((rx-intv*0.5)/(intv*0.5)*Math.PI);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

export function drawFastActivity(ctx, width, height){
  const centerY=height/2, points=200;
  for(let i=0;i<points;i++){
    const x=(i/points)*width; let y=centerY;
    y += 30*Math.sin(x/width*Math.PI*30);
    if (x>width*0.2 && x<width*0.4) y += 20*Math.sin(x/width*Math.PI*40);
    if (x>width*0.6 && x<width*0.8) y += 20*Math.sin(x/width*Math.PI*40);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

export function drawPhoticResponsePattern(ctx, width, height){
  const centerY=height/2, points=200;
  for(let i=0;i<points;i++){
    const x=(i/points)*width; let y=centerY;
    y += 10*Math.sin(x/width*Math.PI*15);
    if (x>width*0.3 && x<width*0.7){
      const flashF=10, flashIntv = width/flashF;
      const flashPos = Math.floor((x-width*0.3)/flashIntv);
      const rx = (x-width*0.3)-flashPos*flashIntv;
      if (rx < flashIntv*0.2) y -= 50*(rx/(flashIntv*0.2));
      else if (rx < flashIntv*0.4) y -= 50 - 50*((rx-flashIntv*0.2)/(flashIntv*0.2));
    }
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

export function drawFocalSharpWaves(ctx, width, height, focusX){
  const centerY=height/2, points=200;
  for(let i=0;i<points;i++){
    const x=(i/points)*width; let y=centerY;
    y += 10*Math.sin(x/width*Math.PI*10);
    const d = Math.abs(x - focusX);
    if (d < width*0.2){
      const f = 1 - d/(width*0.2);
      y -= 40*f*Math.sin(x/width*Math.PI*5);
    }
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

export function drawDipoleSpikes(ctx, width, height){
  const centerY=height/2, points=200, intv=width/3;
  for(let i=0;i<points;i++){
    const x=(i/points)*width, pos=Math.floor(x/intv), rx=x-pos*intv;
    let y=centerY;
    if (rx<intv*0.3) y -= (rx/(intv*0.3))*60;
    else if (rx<intv*0.6) y -= 60 - ((rx-intv*0.3)/(intv*0.3))*120;
    else y += 60*(rx - intv*0.6)/(intv*0.4);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

export function drawPeriodicDischarges(ctx, width, height){
  const centerY=height/2, points=200, intv=width/4;
  for(let i=0;i<points;i++){
    const x=(i/points)*width, pos=Math.floor(x/intv), rx=x-pos*intv;
    let y=centerY + 5*Math.sin(x/width*Math.PI*8);
    if (rx<intv*0.2) y -= 50*(rx/(intv*0.2));
    else if (rx<intv*0.4) y -= 50 - 50*((rx-intv*0.2)/(intv*0.2));
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

/* --- NEW normal/sleep renderers --- */
export function drawAlpha(ctx, width, height){
  const centerY=height/2, points=600; // finer for smooth alpha
  for(let i=0;i<points;i++){
    const x=(i/points)*width;
    const envelope = 1 - 0.2*Math.cos(2*Math.PI*x/width); // slight posterior dominance feel
    const y = centerY + 20*envelope*Math.sin(2*Math.PI*10*x/width); // ~10Hz vis
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

export function drawBeta(ctx, width, height){
  const centerY=height/2, points=600;
  for(let i=0;i<points;i++){
    const x=(i/points)*width;
    const y = centerY + 6*Math.sin(2*Math.PI*25*x/width) + (Math.random()-0.5)*2;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

export function drawMu(ctx, width, height){
  const centerY=height/2, points=600;
  for(let i=0;i<points;i++){
    const x=(i/points)*width;
    // arciform, comb-like with flat tops
    const base = Math.sin(2*Math.PI*9*x/width);
    const shaped = Math.sign(base)*Math.pow(Math.abs(base),0.4); // flatten peaks
    const y = centerY + 14*shaped;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

export function drawSpindle(ctx, width, height){
  const centerY=height/2, points=800;
  const start=width*0.25, end=width*0.75;
  for(let i=0;i<points;i++){
    const x=(i/points)*width;
    const t = (x - (start+end)/2)/( (end-start)/2 );
    const envelope = Math.max(0, 1 - t*t); // simple triangular/gaussian-ish
    const y = centerY + 10*envelope*Math.sin(2*Math.PI*13*x/width);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

export function drawKComplex(ctx, width, height){
  const centerY=height/2, points=400;
  for(let i=0;i<points;i++){
    const x=(i/points)*width; let y=centerY;
    // negative sharp then positive slow
    if (x>width*0.45 && x<width*0.5){
      const rx = (x - width*0.45)/(width*0.05);
      y -= 60*rx; // sharp negative
    } else if (x>=width*0.5 && x<width*0.65){
      const rx = (x - width*0.5)/(width*0.15);
      y += 60*rx; // slow positive
    }
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

export function drawVertex(ctx, width, height){
  const centerY=height/2, points=400;
  for(let i=0;i<points;i++){
    const x=(i/points)*width; let y=centerY;
    if (x>width*0.48 && x<width*0.52){
      const rx = (x - width*0.48)/(width*0.04);
      // narrow, symmetric sharp wave
      y -= 70*Math.sin(Math.PI*rx);
    }
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

export function drawPOSTS(ctx, width, height){
  const centerY=height/2, points=600, occStart=width*0.35, occEnd=width*0.75;
  for(let i=0;i<points;i++){
    const x=(i/points)*width; let y=centerY;
    if (x>occStart && x<occEnd){
      // intermittent positive sharp transients
      if (Math.sin(2*Math.PI*3*x/width) > 0.95){
        y += 25; // positive deflection
      }
    }
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}


