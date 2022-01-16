const slugify=require('slugify');
const puppeteer=require('puppeteer');
const catchAsync = require('./../utils/catchAsync');
const Search=require('./../models/Search');
const Message=require('./../models/Message');
const AppError = require('./../utils/AppError');

//temp
const amazonServices = require('./../services/amazonServices');
const flipkartServices = require('./../services/flipkartServices');
const paytmServices = require('./../services/paytmServices');
const snapdealServices = require('./../services/snapdealServices');
const genric = require('./../utils/genricMethods');


//defining selectors
// const selectors={
//   Amazon:{
//       AmazonElectronics:'div.a-spacing-medium>.sg-row>.sg-col-4-of-12',
//       AmazonOthers:'div.sg-col-inner>.celwidget >.rush-component'
//   },
  
//   Flipkart:{
//       FlipkartElectronics:'div._2kHMtA',
//       FlipkartOthers:'div._4ddWXP',
//       FlipkartClothing:'div._1xHGtK'
//   },
//   Snapdeal:{
//       SnapdealElectronics:'div.product-tuple-listing'
//   },
//   Paytm:{
//       PaytmOthers:'._2i1r'
//   }
// }

// const elementSelectors={
//   Amazon:{
//       AmazonElectronics:{
//           imgurl:'.s-image',
//           title:'.a-size-medium',
//           rating:'.a-icon-alt',
//           price:'.a-offscreen',
//           link:'.a-link-normal'
//       },
//       AmazonOthers:{
//           imgurl:'img.s-image',
//           title:'span.a-size-base-plus',
//           rating:'span.a-icon-alt',
//           price:'span.a-price-whole',
//           link:'a.a-link-normal'
//       }
//   },
//   Flipkart:{
//       FlipkartElectronics:{
//           imgurl:'div._2QcLo->div>div.CXW8mj>img._396cs4 ',
//           title:'div._4rR01T',
//           rating:'._1lRcqv>div._3LWZlK',
//           price:'._3tbKJL>div._25b18c>div._30jeq3',
//           link:'a._1fQZEK'
//       },
//       FlipkartOthers:{
//           imgurl:'a._2rpwqI>div>div>div.CXW8mj>img._396cs4',
//           title:'a.s1Q9rs',
//           rating:'span>div._3LWZlK',
//           price:'a._8VNy32>div._25b18c>div._30jeq3',
//           link:'a._2rpwqI'
//       },
//       FlipkartClothing:{
//           imgurl:'img._2r_T1I',
//           title:'a.IRpwTa',
//           rating:'span>div._3LWZlK',
//           price:'a>div._25b18c>div._30jeq3',
//           link:'a._2UzuFa'
//       }
//   },
//   Snapdeal:{
//       SnapdealElectronics:{
//           imgurl:'img.product-image',
//           title:'a.dp-widget-link>p.product-title ',
//           rating:'div.filled-stars',
//           price:'div.marR10>span.product-price',
//           link:'div.favDp >div.product-tuple-image >a.dp-widget-link'
//       }
//   },
//   Paytm:{
//     PaytmOthers:{
//         imgurl:'._3nWP img',
//         title:'.UGUy ',
//         rating:'div.dummy',
//         price:'._1kMS span',
//         link:'._8vVO'
//     }
//   }
// }

//configure browser
const configureBrowser = async ()=>{
  const browser = await puppeteer.launch({headless:false});
  console.log("browser opened......");
  return browser;
}
// args: ['--no-sandbox']
let browser;
configureBrowser().then(b=>browser=b).catch(err=>console.log(err));


//set url cc
// const setURLAmazon=(productKey)=>{
//   let url=`https://www.amazon.in/s?k=${productKey}&ref=nb_sb_noss`;
//   return url;
// }
// const setURLFlipkart=(productKey)=>{
//   let url=`https://www.flipkart.com/search?q=${productKey}`;
//   return url;
// }
// const setURLSnapdeal=(productKey)=>{
//   let url=`https://www.snapdeal.com/search?keyword=${productKey}`;
//   return url;
// }
// const setURLPaytm=(productKey)=>{
//   let url=`https://paytmmall.com/shop/search?q=${productKey}&from=organic&child_site_id=6&site_id=2`;
//   return url;
// }
//goto url
// const gotoURL =async(page,url)=>{
//   // console.log("gotoUrl:"+url);
//   await page.goto(url,{waitUntil:'load',timeout:0});
//   // console.log("executed till goto");
//   await page.waitForSelector('body');
//   // console.log("url opened..");
//   return page;
// }


//fetch data
// const fetchData=async(page,selector,elementSelector)=>{
//   //let selector='span.a-size-medium';
//  let html=await page.evaluate((selector,elementSelector)=>{
//      let list=document.body.querySelectorAll(selector);
//      list=Array.from(list);
//      list=list.map(el=>{
//      let imgurl=null,title=null,price=null,rating=null,link=null;
//      if(el.querySelector(elementSelector.imgurl))
//      imgurl= el.querySelector(elementSelector.imgurl).src;
//      if(el.querySelector(elementSelector.title))
//      title=el.querySelector(elementSelector.title).textContent;
//      if(el.querySelector(elementSelector.price))
//      price=el.querySelector(elementSelector.price).textContent;
//      if(el.querySelector(elementSelector.rating))
//      rating=el.querySelector(elementSelector.rating).textContent;
//      if(el.querySelector(elementSelector.link))
//      link=el.querySelector(elementSelector.link).href;
//      return {imgurl,title,price,rating,link};
//       });
//      return list;
//  },selector,elementSelector);
// //  console.log("element extracted.....");
// //  console.log(html);
//  return html;
// }

//data proccessing
// const processDataAmazon=(data)=>{
//   let newData=[];
//   for(let i=0;i<data.length;i++)
//   {
//        newData.push({imgurl:data[i].imgurl,title:data[i+1].title,price:data[i+1].price,rating:data[i+1].rating,link:data[i+1].link});
//        i++;
//   }
//   return newData;
// }
// const modifyRatings=(data)=>{
//   // console.log("modifiying ratings");
//   data.forEach(el=>{
//     if(el.rating)
//     el.rating=el.rating.split(' ')[0];
//   });
//   // console.log(data);
//   // console.log("ratings modified");
//   return data;
// }
// const removeRsSymbol=(data)=>{
//   //console.log(data);
//   data.forEach(el=>{
//     if(el.price)
//     {
//     el.price=el.price.replace('₹','');
//     el.price=el.price.replace(/\,/g,'');
//     }
//   });
//   // console.log("rs symbol removed");
//   return data;
// }
// const formatPriceSnapdeal=(data)=>{
//   data.forEach(el=>el.price=el.price.replace('Rs.  ',''));
//   return data;
// }
// const formatPricePaytm=(data)=>{
//   // console.log('format paytm invoked');
//   data.forEach(el=>el.price=el.price.replace(/,/g,''));
//   return data;
// }
// const filterIncompleteData=(data)=>{
//   data=data.filter((el,idx)=>{
//      if(el.imgurl===""||el.price===""||el.title===""||el.link===""||el.imgurl===null||el.price===null||el.title===null||el.link===null)
//      {
//         return false;
//      }
//      return true;
//   });
//   return data;
// }
// const getMinAmount=(...datas)=>{
//    let sum=0,max=-1,count=0;
//    datas.forEach(el=>{
//         console.log('array selected...');
//         el.slice(0,10).forEach(ele=>{
//           if(ele.price)
//           {
//             if(max<parseInt(ele.price))
//             max=parseInt(ele.price);
//             sum+=parseInt(ele.price);
//             count++;
//             console.log("ele.price="+ele.price);
//             console.log("max="+max+" sum="+sum+" count="+count);
//           }
//         })
//    });
//    console.log(max);
//    console.log(sum);
//    console.log(count);
//    return ((sum-max)/(count-1))-(max-((sum-max)/(count-1)))>(((sum-max)/(count-1))/2)?((sum-max)/(count-1))-(max-((sum-max)/(count-1))):(((sum-max)/(count-1))/2);
// }
// const filterInvalidPriceResults = (minAmount,data)=>{
//   return data.filter((el)=>{
//     if(parseInt(el.price)<minAmount)
//     {
//       return false;
//     }
//     return true;
//   })
// }
// const concatData =(data,...datas)=>{
//   let maxLen=0;
//   datas.forEach(el=>{
//       if(maxLen<el.length)
//       maxLen=el.length;
//   });
//   for(let i=0;i<maxLen;i++)
//   {
//     datas.forEach(el=>{
//       if(el[i])
//       {
//         data=data.concat([el[i]]);
//       }
//     })
//   }
//   //console.log(data);
//   return data;
// }
//site specific main functions
// const getAmazonData = async(productKey)=>{
//     try{
//     let page=await browser.newPage();
//     await page.setRequestInterception(true);
//     page.on('request',(req)=>{
//       if(req.resourceType()=='image'||req.resourceType()=='font'||req.resourceType()=='stylesheet')
//       {
//         req.abort();
//       }
//       else
//       {
//         req.continue();
//       }
//     });
//     // console.log("page opened......");

//     let productName=slugify(productKey,'+');
//     let url=setURLAmazon(productName);
//     page=await gotoURL(page,url);
    
//     let amazonData = await fetchData(page,selectors.Amazon.AmazonElectronics,elementSelectors.Amazon.AmazonElectronics);
//     if(amazonData.length===0)
//     {amazonData=await fetchData(page,selectors.Amazon.AmazonOthers,elementSelectors.Amazon.AmazonOthers);}
//     else
//     amazonData=processDataAmazon(amazonData);

//     //console.log("ad:"+amazonData);
//     // console.log('now modifying things..');
//     amazonData=modifyRatings(amazonData);
//     // console.log("---------");
//     amazonData=removeRsSymbol(amazonData);
//     // console.log("executed till here...");
//     await page.close();

//     return amazonData;
//     }
//     catch(err)
//     {
      
//       console.log(err);
//       await page.close();
//       return [];
//     }
// }

// const getFlipkartData = async(productKey)=>{

//   try{
//   let page=await browser.newPage();
//   await page.setRequestInterception(true);
//   page.on('request',(req)=>{
//     if(req.resourceType()=='image'||req.resourceType()=='font'||req.resourceType()=='stylesheet')
//     {
//       req.abort();
//     }
//     else
//     {
//       req.continue();
//     }
//   });
//   // console.log("page opened flipkart......");

//   let productName=slugify(productKey,'+');

//   let url=setURLFlipkart(productName);
//   page=await gotoURL(page,url);
//   let flipkartData = await fetchData(page,selectors.Flipkart.FlipkartElectronics,elementSelectors.Flipkart.FlipkartElectronics);
//   //console.log(flipkartData);
//   if(flipkartData.length===0)
//   flipkartData = await fetchData(page,selectors.Flipkart.FlipkartOthers,elementSelectors.Flipkart.FlipkartOthers);
//   if(flipkartData.length===0)
//   flipkartData = await fetchData(page,selectors.Flipkart.FlipkartClothing,elementSelectors.Flipkart.FlipkartClothing);

//   flipkartData=removeRsSymbol(flipkartData);

//   await page.close(); 

//   return flipkartData;
//   }catch(err){
//     await page.close();
//     console.log(err);
//     return [];
//   }
// }

// const getSnapdealData =async(productKey)=>{
//   try{
//   let page=await browser.newPage();
//   await page.setRequestInterception(true);
//   page.on('request',(req)=>{
//     if(req.resourceType()=='image'||req.resourceType()=='font'||req.resourceType()=='stylesheet')
//     {
//       req.abort();
//     }
//     else
//     {
//       req.continue();
//     }
//   });
//   // console.log("page opened......");

//   let productName=slugify(productKey,'+').replace(/\+/g,"%20");

//   let url=setURLSnapdeal(productName);
//   page=await gotoURL(page,url);
//   let snapdealData = await fetchData(page,selectors.Snapdeal.SnapdealElectronics,elementSelectors.Snapdeal.SnapdealElectronics);
//   snapdealData=formatPriceSnapdeal(snapdealData);
//   snapdealData=removeRsSymbol(snapdealData);
//   await page.close();
//   return snapdealData;
//   }
//   catch(err)
//   {
//     await page.close();
//     console.log(err);
//     return [];
//   }
// }
// https://paytmmall.com/shop/search?q=iphone%2012&from=organic&child_site_id=6&site_id=2&category=66781&brand=1707
// https://paytmmall.com/shop/search?q=t-shirts&from=organic&child_site_id=6&site_id=2&category=5030%2C5188
// https://paytmmall.com/shop/search?q=table&from=organic&child_site_id=6&site_id=2&category=26611%2C8145
// https://paytmmall.com/shop/search?q=books&from=organic&child_site_id=6&site_id=2&category=6559
// https://paytmmall.com/shop/search?q=toys&from=organic&child_site_id=6&site_id=2&category=10022
// const getPaytmData = async(productKey)=>{
//   try{
//     let page=await browser.newPage();
//     await page.setRequestInterception(true);
//     page.on('request',(req)=>{
//       if(req.resourceType()=='image'||req.resourceType()=='font'||req.resourceType()=='stylesheet')
//       {
//         req.abort();
//       }
//       else
//       {
//         req.continue();
//       }
//     });
//     // console.log('new page opened...');
//     let productName=slugify(productKey,'+').replace(/\+/g,"%20");
//     let url=setURLPaytm(productName);
//     // console.log(page);
//     // console.log("url set");
//     page=await gotoURL(page,url);
//     // console.log(page);
//     // console.log("paytm page loaded");
//     let paytmData = await fetchData(page,selectors.Paytm.PaytmOthers,elementSelectors.Paytm.PaytmOthers);
//     // console.log(paytmData);
//     paytmData = formatPricePaytm(paytmData);
//     // console.log(paytmData);
//     await page.close();
//     return paytmData;
//   }
//   catch(err)
//   {
//     await page.close();
//     console.log(err);
//     return [];
//   }
// }

//DATABASE OPERATIONS
const saveSearch=async(productname,length,sortby)=>{
  try{
  const sort=sortby==="rating"?sortby:'price';
  await Search.create({
    productKey:productname,
    noOfResults:length,
    sortedBy:sort
  });
  }catch(err){
    console.log(err);
  }
}
exports.getProducts=catchAsync(async(req,res)=>{
  
    let productName=req.query.productName;
    //let [amazonData,flipkartData,snapdealData]= await Promise.all([getAmazonData(productName),getFlipkartData(productName),getSnapdealData(productName)].map(e=>e.catch(err=>console.log(err))));
    let amazonData=[];
    let amazonservices = new amazonServices(productName);
    try{
      amazonData= await amazonservices.getAmazonData(browser);
    }catch(err){console.log(err);}
    if(!amazonData)
    {
      try{
        amazonData= await amazonservices.getAmazonData(browser);
      }catch(err){console.log(err);}
    }
    console.log(amazonData);
    let flipkartData=[];
    let flipkartservices = new flipkartServices(productName);

    try{
      flipkartData=await flipkartservices.getFlipkartData(browser);
    }catch(err){console.log(err);}
    if(!flipkartData)
    {
      try{
        flipkartData=await flipkartservices.getFlipkartData(browser);
      }catch(err){console.log(err);}
    }
    console.log(flipkartData);

    let paytmData=[];
    let paytmservices = new paytmServices(productName);

    try{
      paytmData=await paytmservices.getPaytmData(browser);
    }catch(err){console.log(err);}
    if(!paytmData)
    {
      try{
        paytmData=await paytmservices.getPaytmData(browser);
      }catch(err){console.log(err);}
    }
    let snapdealData=[];
    let snapdealservices = new snapdealServices(productName);

    try{
      snapdealData=await snapdealservices.getSnapdealData(browser);
    }catch(err){console.log(err);}
    let minAmount = genric.getMinAmount(amazonData,flipkartData,paytmData);
    // let minAmount = genric.getMinAmount(snapdealData);

    // console.log(minAmount);
    //convert all data to a single array
    let data=[];
    data=genric.concatData(data,amazonData,flipkartData,snapdealData,paytmData);
    // data=genric.concatData(data,snapdealData);

    // if(amazonData)
    // {
    //   amazonData=amazonData.slice(0,5);
    //   data=data.concat(amazonData);
    // }
    // if(flipkartData)
    // {
    //   flipkartData=flipkartData.slice(0,5);
    //   data=data.concat(flipkartData);
    // }
    // if(snapdealData)
    // {
    //   snapdealData=snapdealData.slice(0,5);
    //   data=data.concat(snapdealData);
    // }
    // if(paytmData)
    // {
    //   paytmData=paytmData.slice(0,5);
    //   data=data.concat(paytmData);
    // }
    //[...amazonData,...flipkartData,...snapdealData];
  
    //filter out objects with null and empty values except ratings
    data=genric.filterIncompleteData(data);
    data=genric.filterInvalidPriceResults(minAmount,data);
    data=data.slice(0,16);
    //sortBy functionality default price
    if(req.query.sortBy==='rating')
    { console.log("sorting data acc to rating");
      data.sort((a,b)=>{
      if((a.rating===null)&&(b.rating===null))
      {
        return 0;
      }
      else if(a.rating===null)
      {
        return parseFloat(b.rating)-2;
      }
      else if(b.rating===null)
      {
        return 2-parseFloat(a.rating);
      }
      else
      {
        return parseFloat(b.rating)-parseFloat(a.rating);
      }
      });
    }
    else if(req.query.sortBy==='price')
    {data.sort((a,b)=>parseInt(a.price)-parseInt(b.price));}

    //save search to DB
    await saveSearch(req.query.productName,data.length,req.query.sortBy);

    res.status(200).json({
        length:data.length,
        data
    });

});

exports.getSearchCount =catchAsync(async(req,res,next)=>{
  const searchCount=await Search.find().countDocuments();

  res.status(200).json({
      status:'success',
      searchCount
  });
});

exports.saveMessage = catchAsync(async(req,res,next)=>{
    if(!req.body.name||!req.body.email||!req.body.message)
    {
      return next(new AppError('name,email or message is not defined!',400));
    }
    const name=req.body.name;
    const email=req.body.email;
    const message=req.body.message;

    const msg=await Message.create({name,email,message});

    res.status(200).json({
      status:'success',
      data:msg
    });
});