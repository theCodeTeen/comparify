exports.gotoURL =async(page,url)=>{
    // console.log("gotoUrl:"+url);
    await page.goto(url,{waitUntil:'load',timeout:0});
    // console.log("executed till goto");
    await page.waitForSelector('body');
    // console.log("url opened..");
    return page;
  }
exports.fetchData=async(page,selector,elementSelector)=>{
    //let selector='span.a-size-medium';
   let html=await page.evaluate((selector,elementSelector)=>{
       let list=document.body.querySelectorAll(selector);
       list=Array.from(list);
       list=list.map(el=>{
       let imgurl=null,title=null,price=null,rating=null,link=null;
       if(el.querySelector(elementSelector.imgurl))
       imgurl= el.querySelector(elementSelector.imgurl).src;
       if(el.querySelector(elementSelector.title))
       title=el.querySelector(elementSelector.title).textContent;
       if(el.querySelector(elementSelector.price))
       price=el.querySelector(elementSelector.price).textContent;
       if(el.querySelector(elementSelector.rating))
       rating=el.querySelector(elementSelector.rating).textContent;
       if(el.querySelector(elementSelector.link))
       link=el.querySelector(elementSelector.link).href;
       return {imgurl,title,price,rating,link};
        });
       return list;
   },selector,elementSelector);
  //  console.log("element extracted.....");
  //  console.log(html);
   return html;
  }
  exports.removeRsSymbol=(data)=>{
    //console.log(data);
    data.forEach(el=>{
      if(el.price)
      {
      el.price=el.price.replace('₹','');
      el.price=el.price.replace(/\,/g,'');
      }
    });
    // console.log("rs symbol removed");
    return data;
  }
  exports.selectors={
    Amazon:{
        AmazonElectronics:'div.a-spacing-medium>.sg-row>.sg-col-4-of-12',
        AmazonOthers:'div.sg-col-inner>.celwidget >.rush-component'
    },
    
    Flipkart:{
        FlipkartElectronics:'div._2kHMtA',
        FlipkartOthers:'div._4ddWXP',
        FlipkartClothing:'div._1xHGtK'
    },
    Snapdeal:{
        SnapdealElectronics:'div.product-tuple-listing'
    },
    Paytm:{
        PaytmOthers:'._2i1r'
    }
  }
  
  exports.elementSelectors={
    Amazon:{
        AmazonElectronics:{
            imgurl:'.s-image',
            title:'.a-size-medium',
            rating:'.a-icon-alt',
            price:'.a-offscreen',
            link:'.a-link-normal'
        },
        AmazonOthers:{
            imgurl:'img.s-image',
            title:'span.a-size-base-plus',
            rating:'span.a-icon-alt',
            price:'span.a-price-whole',
            link:'a.a-link-normal'
        }
    },
    Flipkart:{
        FlipkartElectronics:{
            imgurl:'div._2QcLo->div>div.CXW8mj>img._396cs4 ',
            title:'div._4rR01T',
            rating:'._1lRcqv>div._3LWZlK',
            price:'._3tbKJL>div._25b18c>div._30jeq3',
            link:'a._1fQZEK'
        },
        FlipkartOthers:{
            imgurl:'a._2rpwqI>div>div>div.CXW8mj>img._396cs4',
            title:'a.s1Q9rs',
            rating:'span>div._3LWZlK',
            price:'a._8VNy32>div._25b18c>div._30jeq3',
            link:'a._2rpwqI'
        },
        FlipkartClothing:{
            imgurl:'img._2r_T1I',
            title:'a.IRpwTa',
            rating:'span>div._3LWZlK',
            price:'a>div._25b18c>div._30jeq3',
            link:'a._2UzuFa'
        }
    },
    Snapdeal:{
        SnapdealElectronics:{
            imgurl:'img.product-image',
            title:'a.dp-widget-link>p.product-title ',
            rating:'div.filled-stars',
            price:'div.marR10>span.product-price',
            link:'div.favDp >div.product-tuple-image >a.dp-widget-link'
        }
    },
    Paytm:{
      PaytmOthers:{
          imgurl:'._3nWP img',
          title:'.UGUy ',
          rating:'div.dummy',
          price:'._1kMS span',
          link:'._8vVO'
      }
    }
  }
  exports.getMinAmount=(...datas)=>{
    let sum=0,max=-1,count=0;
    datas.forEach(el=>{
         console.log('array selected...');
         el.slice(0,10).forEach(ele=>{
           if(ele.price)
           {
             if(max<parseInt(ele.price))
             max=parseInt(ele.price);
             sum+=parseInt(ele.price);
             count++;
             console.log("ele.price="+ele.price);
             console.log("max="+max+" sum="+sum+" count="+count);
           }
         })
    });
    console.log(max);
    console.log(sum);
    console.log(count);
    return ((sum-max)/(count-1))-(max-((sum-max)/(count-1)))>(((sum-max)/(count-1))/2)?((sum-max)/(count-1))-(max-((sum-max)/(count-1))):(((sum-max)/(count-1))/2);
 }
 exports.concatData =(data,...datas)=>{
    let maxLen=0;
    datas.forEach(el=>{
        if(maxLen<el.length)
        maxLen=el.length;
    });
    for(let i=0;i<maxLen;i++)
    {
      datas.forEach(el=>{
        if(el[i])
        {
          data=data.concat([el[i]]);
        }
      })
    }
    //console.log(data);
    return data;
  }
  exports.filterInvalidPriceResults = (minAmount,data)=>{
    return data.filter((el)=>{
      if(parseInt(el.price)<minAmount)
      {
        return false;
      }
      return true;
    })
  }
  exports.filterIncompleteData=(data)=>{
    data=data.filter((el,idx)=>{
       if(el.imgurl===""||el.price===""||el.title===""||el.link===""||el.imgurl===null||el.price===null||el.title===null||el.link===null)
       {
          return false;
       }
       return true;
    });
    return data;
  }