const genric = require('./../utils/genricMethods');
const slugify=require('slugify');
class flipkartServices{
    constructor(productkey)
    {
        this.productkey=productkey;
    }
    setURLFlipkart(productKey){
        let url=`https://www.flipkart.com/search?q=${productKey}`;
        return url;
    }
    async getFlipkartData(browser){

        try{
        let page=await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request',(req)=>{
          if(req.resourceType()=='image'||req.resourceType()=='font'||req.resourceType()=='stylesheet')
          {
            req.abort();
          }
          else
          {
            req.continue();
          }
        });
        console.log("page opened flipkart......");
      
        let productName=slugify(this.productkey,'+');
        console.log(productName);
        let url=this.setURLFlipkart(productName);
        console.log('url');
        page=await genric.gotoURL(page,url);
        console.log("page url opened.....");

        let flipkartData = await genric.fetchData(page,genric.selectors.Flipkart.FlipkartElectronics,genric.elementSelectors.Flipkart.FlipkartElectronics);
        console.log(flipkartData);
        if(flipkartData.length===0)
        flipkartData = await genric.fetchData(page,genric.selectors.Flipkart.FlipkartOthers,genric.elementSelectors.Flipkart.FlipkartOthers);
        if(flipkartData.length===0)
        flipkartData = await genric.fetchData(page,genric.selectors.Flipkart.FlipkartClothing,genric.elementSelectors.Flipkart.FlipkartClothing);
      
        flipkartData=genric.removeRsSymbol(flipkartData);
      
        await page.close(); 
      
        return flipkartData;
        }catch(err){
          await page.close();
          console.log(err);
          return [];
        }
      }
}
module.exports = flipkartServices;