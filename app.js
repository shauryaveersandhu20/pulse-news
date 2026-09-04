const categories={general:"Top Stories",world:"World",nation:"India",business:"Business",technology:"Technology",science:"Science",sports:"Sports",entertainment:"Entertainment"};
let category="general",items=[];
const nav=document.querySelector("#nav");
nav.innerHTML=Object.entries(categories).map(([k,v])=>`<button data-cat="${k}" class="${k==="general"?"active":""}">${v}</button>`).join("");
nav.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;document.querySelectorAll("nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active");category=b.dataset.cat;load()});
document.querySelector("#refresh").onclick=load;
document.querySelector("#search").oninput=render;
document.querySelector("#mode").onclick=()=>document.body.classList.toggle("dark");

function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function articleUrl(x){return `article.html?title=${encodeURIComponent(x.title||"")}&description=${encodeURIComponent(x.description||"")}&source=${encodeURIComponent(x.source||"News")}&time=${encodeURIComponent(x.time||"")}&link=${encodeURIComponent(x.link||"")}&image=${encodeURIComponent(x.image||"")}`}
function render(){
 const q=document.querySelector("#search").value.toLowerCase();
 const list=items.filter(x=>(x.title+" "+x.description).toLowerCase().includes(q));
 document.querySelector("#news").innerHTML=list.length?list.map(x=>`<article class="card">
 <img class="pic" src="${esc(x.image||"")}" onerror="this.style.display='none'">
 <div class="body"><div class="tag">${esc(x.source||"News")}</div><h2>${esc(x.title)}</h2>
 <p>${esc(x.description||"")}</p><div class="bottom"><span>${esc(x.time||"")}</span><a href="${articleUrl(x)}">Read ↗</a></div></div></article>`).join(""):`<div class="empty">No matching stories.</div>`;
}
async function load(){
 document.querySelector("#status").textContent="Fetching latest headlines…";document.querySelector("#error").textContent="";
 try{
  const r=await fetch(`/api/news?category=${encodeURIComponent(category)}`,{cache:"no-store"});
  if(!r.ok)throw new Error("News service unavailable");
  items=await r.json();
  document.querySelector("#status").textContent=`Updated ${new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}`;
  render();
 }catch(e){
  document.querySelector("#status").textContent="Unable to update";
  document.querySelector("#error").textContent="Could not load news. Try Refresh in a moment.";
  document.querySelector("#news").innerHTML="";
 }
}
load();
setInterval(load,10*60*1000);
