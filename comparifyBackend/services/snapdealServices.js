const genric = require('./../utils/genricMethods');
const slugify=require('slugify');
class snapdealServices{
    constructor(productkey)
    {
        this.productkey=productkey;
    }
    setURLSnapdeal(productKey){
        let url=`https://www.snapdeal.com/search?keyword=${productKey}`;
        return url;
    }
    formatPriceSnapdeal=(data)=>{
        data.forEach(el=>el.price=el.price.replace('Rs.  ',''));
        return data;
    }
    async getSnapdealData(browser){
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
        // console.log("page opened......");
      
        let productName=slugify(this.productkey,'+').replace(/\+/g,"%20");
      
        let url=this.setURLSnapdeal(productName);
        page=await genric.gotoURL(page,url);
        let snapdealData = await genric.fetchData(page,genric.selectors.Snapdeal.SnapdealElectronics,genric.elementSelectors.Snapdeal.SnapdealElectronics);
        snapdealData=this.formatPriceSnapdeal(snapdealData);
        snapdealData=genric.removeRsSymbol(snapdealData);
        await page.close();
        return snapdealData;
        }
        catch(err)
        {
        //   await page.close();
          console.log(err);
          return [];
        }
    }
}
module.exports = snapdealServices;