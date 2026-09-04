const feeds={
 general:"https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en",
 world:"https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-IN&gl=IN&ceid=IN:en",
 nation:"https://news.google.com/rss/headlines/section/topic/NATION?hl=en-IN&gl=IN&ceid=IN:en",
 business:"https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en",
 technology:"https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-IN&gl=IN&ceid=IN:en",
 science:"https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en-IN&gl=IN&ceid=IN:en",
 sports:"https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-IN&gl=IN&ceid=IN:en",
 entertainment:"https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-IN&gl=IN&ceid=IN:en"
};
function clean(s){
 let text=(s||"").replace(/<!\[CDATA\[|\]\]>/g,"");
 text=text.replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&amp;/gi,"&");
 text=text.replace(/<script[\s\S]*?<\/script>/gi,"").replace(/<style[\s\S]*?<\/style>/gi,"").replace(/<[^>]*>/g,"");
 text=text.replace(/&nbsp;/gi," ").replace(/&ldquo;|&rdquo;/gi,'"').replace(/&lsquo;|&rsquo;/gi,"'").replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCharCode(parseInt(n,16)));
 return text.replace(/\s+/g," ").trim()
}
function getTag(xml,tag){const m=xml.match(new RegExp(`<${tag}(?: [^>]*)?>([\\s\\S]*?)</${tag}>`,"i"));return m?clean(m[1]):""}
module.exports = async function handler(req,res){
 const cat=(req.query?.category||"general").toLowerCase();
 const url=feeds[cat]||feeds.general;
 try{
  const response=await fetch(url,{headers:{"User-Agent":"PulseNews/1.0"}});
  const xml=await response.text();
  const blocks=xml.match(/<item>[\s\S]*?<\/item>/gi)||[];
  const data=blocks.slice(0,18).map(item=>{
   const title=getTag(item,"title"),link=getTag(item,"link"),description=getTag(item,"description"),pub=getTag(item,"pubDate");
   const source=getTag(item,"source");
   return {title,link,description,time:pub?new Date(pub).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}):"",source};
  }).filter(x=>x.title&&x.link);
  res.setHeader("Cache-Control","s-maxage=300, stale-while-revalidate=600");
  res.status(200).json(data);
 }catch(e){res.status(502).json({error:"feed_error"})}
}
