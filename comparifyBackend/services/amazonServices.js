const genric = require('./../utils/genricMethods');
const slugify=require('slugify');
class amazonServices{
    constructor(productkey)
    {
        this.productkey=productkey;
    }
    setURLAmazon(productKey){
        let url=`https://www.amazon.in/s?k=${productKey}&ref=nb_sb_noss`;
        return url;
    }
    processDataAmazon(data){
        let newData=[];
        for(let i=0;i<data.length;i++)
        {
             newData.push({imgurl:data[i].imgurl,title:data[i+1].title,price:data[i+1].price,rating:data[i+1].rating,link:data[i+1].link});
             i++;
        }
        return newData;
    }
    modifyRatings(data){
        // console.log("modifiying ratings");
        data.forEach(el=>{
          if(el.rating)
          el.rating=el.rating.split(' ')[0];
        });
        // console.log(data);
        // console.log("ratings modified");
        return data;
      }
    async getAmazonData(browser){
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
        
            let productName=slugify(this.productkey,'+');
            let url=this.setURLAmazon(productName);
            page=await genric.gotoURL(page,url);
            
            let amazonData = await genric.fetchData(page,genric.selectors.Amazon.AmazonElectronics,genric.elementSelectors.Amazon.AmazonElectronics);
            if(amazonData.length===0)
            {amazonData=await genric.fetchData(page,genric.selectors.Amazon.AmazonOthers,genric.elementSelectors.Amazon.AmazonOthers);}
            else
            amazonData=this.processDataAmazon(amazonData);
        
            //console.log("ad:"+amazonData);
            // console.log('now modifying things..');
            amazonData=this.modifyRatings(amazonData);
            // console.log("---------");
            amazonData=genric.removeRsSymbol(amazonData);
            // console.log("executed till here...");
            await page.close();
        
            return amazonData;
            }
            catch(err)
            {
              
              console.log(err);
              await page.close();
              return [];
            }
    }
}
module.exports = amazonServices;