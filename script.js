<script>
(function(){
const sliders=[
  {el:slider1,val:val1,range:range1,max:10},
  {el:slider2,val:val2,range:range2,max:5},
  {el:slider3,val:val3,range:range3,max:5}
];
const totalEl=document.getElementById('total');
const totalRange=document.getElementById('totalRange');
const round1=x=>Math.round(x*10)/10;

function categoryText(v,max){
  let category,low,high;
  if(max===10){
    if(v<=2.0){category="Poor";low=0;high=2.0;}
    else if(v<=4.0){category="Managing";low=2.1;high=4.0;}
    else if(v<=6.0){category="Adequate";low=4.1;high=6.0;}
    else if(v<=8.0){category="Good";low=6.1;high=8.0;}
    else {category="Excellent";low=8.1;high=10.0;}
    const values=[];for(let x=low;x<=high+0.0001;x+=0.1)values.push(round1(x));
    const len=values.length;let cut1,cut2;
    if(category==="Good"||category==="Excellent"){cut1=Math.min(len,6);cut2=Math.min(len,cut1+7);}
    else{cut1=Math.floor(len/3);cut2=Math.floor(len*2/3);}
    const lowEnd=values[cut1-1]??low, midEnd=values[cut2-1]??high;
    return {level:v<=lowEnd?"Low":v<=midEnd?"Mid":"High",category};
  }else{
    if(v<=1.0){category="Poor";low=0;high=1.0;}
    else if(v<=2.0){category="Managing";low=1.1;high=2.0;}
    else if(v<=3.0){category="Adequate";low=2.1;high=3.0;}
    else if(v<=4.0){category="Good";low=3.1;high=4.0;}
    else {category="Excellent";low=4.1;high=5.0;}
    const values=[];for(let x=low;x<=high+0.0001;x+=0.1)values.push(round1(x));
    const len=values.length;let cut1,cut2;
    if(category==="Good"||category==="Excellent"){cut1=3;cut2=6;}
    else{cut1=Math.floor(len/3);cut2=Math.floor(len*2/3);}
    const lowEnd=values[cut1-1]??low, midEnd=values[cut2-1]??high;
    return {level:v<=lowEnd?"Low":v<=midEnd?"Mid":"High",category};
  }
}

function totalCategoryText(total){
  if(total<=0) return "";
  let category,low,high;
  if(total<=4.0){category="Poor";low=0.1;high=4.0;}
  else if(total<=8.0){category="Managing";low=4.1;high=8.0;}
  else if(total<=12.0){category="Adequate";low=8.1;high=12.0;}
  else if(total<=16.0){category="Good";low=12.1;high=16.0;}
  else {category="Excellent";low=16.1;high=20.0;}
  const values=[];for(let x=low;x<=high+0.0001;x+=0.1)values.push(round1(x));
  const cut1=13,cut2=26;
  const lowEnd=values[cut1-1]??low, midEnd=values[cut2-1]??high;
  const level=total<=lowEnd?"Low":total<=midEnd?"Mid":"High";
  return `${level}-${category}`;
}

function sliderColor(v,max){
  const pct=v/max;
  let r,g;
  if(pct<=0.5){
    r=255; g=Math.round(510*pct);
  }else{
    g=255; r=Math.round(510*(1-pct));
  }
  return `rgb(${r},${g},0)`;
}

let lastTotalText="";
function update(){
  let total=0;
  sliders.forEach(({el,val,range,max})=>{
    const v=round1(parseFloat(el.value));
    val.textContent=v.toFixed(1);
    total+=v;
    const {level,category}=categoryText(v,max);
    range.setAttribute("data-full",`${level}-${category}`);
    range.setAttribute("data-short",`${level}-${category[0]}`);
    const color=sliderColor(v,max);
    el.style.setProperty("--slider-color",color);
    el.style.background=`linear-gradient(to right, red, yellow, green)`;
    el.querySelector=undefined;
  });
  const t=round1(total);
  totalEl.textContent=t.toFixed(1);
  const text=totalCategoryText(t);
  if(text!==lastTotalText){
    totalRange.classList.add("fade-out");
    setTimeout(()=>{
      totalRange.textContent=text;
      totalRange.classList.remove("fade-out");
    },150);
    lastTotalText=text;
  }
}
sliders.forEach(({el})=>{
  el.addEventListener('input',update);
  el.addEventListener('change',update);
});

document.querySelectorAll('.arrow-btn').forEach(btn=>{
  let timer,interval;
  const stepAction=()=>{
    const target=document.getElementById(btn.dataset.target);
    const dir=btn.dataset.dir;
    const step=parseFloat(target.step)||0.1;
    let val=parseFloat(target.value)||0;
    val+=dir==="up"?step:-step;
    val=round1(Math.min(parseFloat(target.max),Math.max(parseFloat(target.min),val)));
    target.value=val;update();
  };
  const startHold=()=>{
    stepAction();
    timer=setTimeout(()=>interval=setInterval(stepAction,100),300);
  };
  const stopHold=()=>{
    clearTimeout(timer);clearInterval(interval);
  };
  btn.addEventListener('mousedown',startHold);
  btn.addEventListener('mouseup',stopHold);
  btn.addEventListener('mouseleave',stopHold);
  btn.addEventListener('touchstart',e=>{e.preventDefault();startHold();},{passive:false});
  btn.addEventListener('touchend',stopHold);
  btn.addEventListener('touchcancel',stopHold);
});

document.querySelectorAll('.tick-container').forEach(tc=>{
  for(let i=0;i<=5;i++){
    const tick=document.createElement('div');
    tick.className='tick';
    tick.style.left=(i*20)+'%';
    tc.appendChild(tick);
  }
});
update();
})();
</script>
