const genric = require('./../utils/genricMethods');
const slugify=require('slugify');
class paytmServices{
    constructor(productkey)
    {
        this.productkey=productkey;
    }
    setURLPaytm(productKey){
        let url=`https://paytmmall.com/shop/search?q=${productKey}&from=organic&child_site_id=6&site_id=2`;
        return url;
    }
    formatPricePaytm(data){
        // console.log('format paytm invoked');
        data.forEach(el=>el.price=el.price.replace(/,/g,''));
        return data;
    }
    async getPaytmData(browser){
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
          // console.log('new page opened...');
          let productName=slugify(this.productkey,'+').replace(/\+/g,"%20");
          let url=this.setURLPaytm(productName);
          // console.log(page);
          // console.log("url set");
          page=await genric.gotoURL(page,url);
          // console.log(page);
          // console.log("paytm page loaded");
          let paytmData = await genric.fetchData(page,genric.selectors.Paytm.PaytmOthers,genric.elementSelectors.Paytm.PaytmOthers);
          // console.log(paytmData);
          paytmData = this.formatPricePaytm(paytmData);
          // console.log(paytmData);
          await page.close();
          return paytmData;
        }
        catch(err)
        {
          await page.close();
          console.log(err);
          return [];
        }
      }
}
module.exports = paytmServices;