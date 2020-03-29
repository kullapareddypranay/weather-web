const path=require('path')
const express=require('express')
const hbs=require('hbs')
const geocode=require('./utils/geocode')


const app=express()
const port=process.env.PORT || 3000
//setting public directory path
const publicDirectoryPath=path.join(__dirname,'../public')
//using static public folder
app.use(express.static(publicDirectoryPath))
//setting viewing for hbs
const viewPaths=path.join(__dirname,'../templates/views')
//setting path for partials that can be reused
const partialPath=path.join(__dirname,'../templates/partials')

//setting up handler bar for dyanamic pages
app.set('view engine','hbs')
app.set('views',viewPaths)
hbs.registerPartials(partialPath)


app.get('',(req,res)=>{
    res.render('index',{
        title:'weather app',
        name:'pranay'
    })
})
app.get('/about',(req,res)=>{
    res.render('about',{
        title:'about me',
        name:'pranay'
    })
})
app.get('/help',(req,res)=>{
    res.render('help',{
        title:'help page',
        contact:'pranay'
    })
})
app.get('/products',(req,res)=>{

    res.send({
        products:[]
    })
})

app.get('/weather',(req,res)=>{
    if(!req.query.search)
    {
        return res.send({
            error:'enter the address'
        })
    }
    geocode.geocode(req.query.search,(error,data)=>{
        if(error){
            return res.send({
                error:error
            })

        }
        geocode.forecast(data.latitude,data.longitude,(error,forecastdata)=>{
            if(error)
            {
               return res.send({
                   error:error
               }) 
            }
           res.send({
               forecast:forecastdata,
               location:data.location
           })
        })
    
    })
})

app.get('/help/*',(req,res)=>{
    res.render('404',{
        title:404,
        name:'pranay',
        errormsg:'help article not found'
    })
})

app.get('*',(req,res)=>{
    res.render('404',{
        title:404,
        name:'pranay',
        errormsg:'file not found'
    })
})


app.listen(port,()=>{
    console.log('server is started on port '+port)
})