
  
const computo = (cantidad) => {
    let numeros = {};
    for (let i=0; i<1000; i++){
        numeros[i+1] = 0;
    }
    for (let i=0; i<cantidad; i++){
        let azar = Math.floor(Math.random() * 1000) + 1;
        numeros[azar]++;
    }
    return numeros
}

process.on('exit', () => {
    console.log(`worker #${process.pid} cerrado`)
})

process.on('message', cantidad => {
    process.send(computo(cantidad)) 
    process.exit() 
})

process.send('listo')