const getList = document.querySelector('.top-4')
const cap = document.querySelector('#cap')
const volume = document.querySelector('#volume')
const allCoins = document.querySelector('#allCoins')
const exchange = document.querySelector('#exchange')
const coinLog = document.querySelector('.coin-log')
const coinForm = document.querySelector('.coin-form')

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '9beeeca580mshb1a906a2cc17480p13ad30jsn25d998968be9',
		'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
	}
};



const getCoin = async () =>{
     
    const response = await fetch('https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0', options)
    const data = await response.json()
    return data.data.coins
}

const getCryptoData = async () =>{
    const response = await fetch('https://coinranking1.p.rapidapi.com/stats?referenceCurrencyUuid=yhjMzLPhuIDl', options)
    const data = await response.json()
    return data.data
}

const searchCoin = async (coinName) =>{
    const base = "https://coinranking1.p.rapidapi.com/search-suggestions?referenceCurrencyUuid=yhjMzLPhuIDl"
    const query = `&query=${coinName}`

    const response = await fetch(base+query,options)
    const data = await response.json()
    const finalData = await getHistory(data.data.coins[0].uuid,data.data)
    return finalData
    
}

const getHistory = async (uuid,mainData) =>{
   
     const respose = await fetch(`https://coinranking1.p.rapidapi.com/coin/${uuid}/history?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h`, options)
	 const data = await respose.json()

     console.log(mainData)
     console.log(data)
     return {
        change : data.data.change,
        todayPrice : data.data.history[0].price,
        yesterdayPrice : data.data.history[1].price,
        prevPrice: data.data.history[2].price,
        icon : mainData.coins[0].iconUrl,
        name : mainData.coins[0].name,
        price : mainData.coins[0].price,
        symbol : mainData.coins[0].symbol
     }
}

coinForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    let coin = coinForm.Coin.value.trim()
    coinForm.reset()
     
    searchCoin(coin).then(finalData=>{
        updateCoinLogs(finalData)
    })
    .catch(err=> console.log(err))
})



const updateCoinLogs = (data) =>{
    coinLog.innerHTML = `
    <div class="service  d-flex justify-content-between align-items-baseline mt-1 mb-2 pt-3 text-center">
                <h4 class=" coin-head ms-4 text-light" href="">Search Results</h4>
                <a class = " coin-head-link d-none d-md-block me-5 h5 text-muted" href="">More info..</a>
    </div>
    <div class="col-12 col-lg-6">
                <div class="custom-coin-card  p-3 bg-dark" >
                    <div class="custom-card-title d-flex align-items-baseline justify-content-around">
                        <p class="lead text-light mb-1">Today</p>
                        <a class="text-muted rank mb-1">more info..</a>
                    </div>
                    <div class="custom-card-body d-flex align-items-start justify-content-evenly mt-3">
                        <div class = "wrap-icon-info">
                           
                            <img src=${data.icon} alt="" style="width: 120px;">
                            
                        </div>
                        
                        <div class="coin-intro-info text-left">
                           <p class="text-muted rank">Coin: <span class=" text-white">${data.name}</span></p>
                           <p class="text-muted rank ">24h: <span class=" text-white lead">${data.change}%</span></p>
                            <p class="text-muted rank ">Price: <span class="lead text-success">$${parseFloat(data.todayPrice).toLocaleString("en-US")}</span></p>
                        </div>
                    </div>
                    
                </div>
            </div>
            <!-- coin card-2 -->
            <div class="col-lg-3">
                <div class="custom-coin-card my-4 my-lg-1 bg-dark p-3 " >
                    <div class="custom-card-title d-flex align-items-baseline justify-content-around">
                        <p class="lead text-light mb-1">Yesterday</p>
                    </div>
                    <div class="coin-icon mt-2 text-center">
                        <img src=${data.icon} alt="" style="width: 95px;">
                    </div>
                    <p class="text-muted text-center mb-1 mt-3">Price: <span class="text-success">$${parseFloat(data.yesterdayPrice).toLocaleString("en-US")}</span> </p>
                </div>
            </div>
            <div class="col-lg-3">
            <div class="custom-coin-card bg-dark p-3 " >
                <div class="custom-card-title d-flex align-items-baseline justify-content-around">
                    <p class="lead text-light mb-1">2 days ago...</p>
                </div>
                <div class="coin-icon mt-2 text-center">
                    <img src=${data.icon} alt="" style="width: 95px;">
                </div>
                <p class="text-muted text-center mb-1 mt-3">Price: <span class="text-success">$${parseFloat(data.prevPrice).toLocaleString("en-US")}</span> </p>
            </div>
        </div>
    `
}

const updateCharts = (data)=>{
    getList.innerHTML = `<h4 class=" coin-head ms-4 text-light " href="">Top Performing Currencies</h4>`
    for(i = 0;i<4;i++) {
        getList.innerHTML += `
        <div class="top-charts bg-dark px-4 py-2 mt-3">
         <h6 class="text-muted ">${data[i].symbol}</h6>
         <div class="chart-content d-flex justify-content-between align-items-center">
           <h5 class="text-light">${data[i].name}</h5>
           <img src="${data[i].iconUrl}" alt="" style="width: 50px;">
         </div>
         <div class="chart-content d-flex justify-content-between align-items-center">
                <p class="text-white mb-1">Price: <span class="text-success">$ ${parseFloat(data[i].price).toLocaleString("en-US")}</span> </p>
                <p class="text-muted mb-1 ">24h: <span class="text-white ">${data[i].change}%</span> </p>
         </div>
           
        </div>
        `
    }
} 

const updateCryptoData = (data)=>{
    const tempCap = parseFloat(data.totalMarketCap) 
    const Cap = tempCap.toLocaleString("en-US")
    cap.innerHTML = `$ ${Cap}`

    const tempVol = parseFloat(data.total24hVolume)  
    const Vol = tempVol.toLocaleString("en-US")
    volume.innerHTML = `$ ${Vol}`

    const tempAll = data.totalCoins
    const All = tempAll.toLocaleString("en-US")
    allCoins.innerHTML = `${All}`

    const tempExc = data.totalExchanges
    const Exc = tempExc.toLocaleString("en-US")
    exchange.innerHTML = `${Exc}`

}



getCoin().then(data=>{
    updateCharts(data)
})

getCryptoData().then(data=>{
    updateCryptoData(data)
})
