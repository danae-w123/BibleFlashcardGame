// Original procedural score: no remote audio, samples, accounts or downloads.
class QuestAudio {
  enabled=true; mode='board'; ctx=null; timer=null; step=0; next=0;
  async start(){
    if(!this.enabled||document.hidden){this.hush();return;}
    try{
      if(!this.ctx){this.ctx=new AudioContext();this.master=this.ctx.createGain();this.master.gain.value=.38;this.master.connect(this.ctx.destination);}
      await this.ctx.resume();
      if(this.timer)return;
      this.next=this.ctx.currentTime+.06;
      this.timer=setInterval(()=>this.schedule(),25);
    }catch{/* Browsers may require another user gesture before enabling audio. */}
  }
  hush(){clearInterval(this.timer);this.timer=null;this.ctx?.suspend();}
  tone(midi,time,duration,volume=.1,type='triangle'){
    const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=440*2**((midi-69)/12);o.connect(g);g.connect(this.master);
    g.gain.setValueAtTime(.0001,time);g.gain.linearRampToValueAtTime(volume,time+.012);g.gain.exponentialRampToValueAtTime(.0001,time+duration);o.start(time);o.stop(time+duration+.02);
  }
  drum(time,strong){
    const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(strong?130:700,time);o.frequency.exponentialRampToValueAtTime(strong?45:140,time+.09);o.type=strong?'sine':'triangle';o.connect(g);g.connect(this.master);g.gain.setValueAtTime(strong?.22:.035,time);g.gain.exponentialRampToValueAtTime(.0001,time+.12);o.start(time);o.stop(time+.13);
  }
  schedule(){
    if(!this.enabled||document.hidden){this.hush();return;}
    const melody=[74,77,81,77,79,77,74,72,70,74,77,81,79,77,74,77,69,72,77,79,81,79,77,72,72,76,79,84,81,79,76,72,74,81,86,84,81,77,79,81,82,81,77,74,77,79,81,77,81,84,89,86,84,81,79,77,79,76,72,76,79,81,76,72];
    while(this.next<this.ctx.currentTime+.14){
      const i=this.step%64,beat=this.step%8,battle=this.mode==='battle',unit=60/(battle?138:110)/2,t=this.next,root=[50,46,53,48][Math.floor(i/8)%4];
      const battleMelody=[74,74,81,77,86,81,79,77,70,77,82,81,77,74,77,81,77,81,84,89,86,84,81,77,72,79,84,83,79,76,79,81];
      this.tone(battle?battleMelody[i%32]:melody[i],t,unit*.85,battle?.12:.09);
      if(beat%2===0)this.tone(root-12,t,unit*1.7,.15,'sine');
      if(beat===0){[root,root+7,root+12].forEach(n=>this.tone(n,t,unit*7,.028,'sine'));}
      if(beat%4===0||battle&&beat%2===0)this.drum(t,true);
      if(beat%2===1)this.drum(t,false);
      if(battle&&beat%2===0)this.tone(root+19,t,unit*.45,.045,'sawtooth');
      this.step++;this.next+=unit;
    }
  }
  effect(success=true){if(!this.enabled||!this.ctx||this.ctx.state!=='running')return;this.tone(success?86:50,this.ctx.currentTime,.16,.08,'sine');}
}
export const questAudio=new QuestAudio();
