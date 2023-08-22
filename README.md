# DSCWOW-DVN
## Configuración
### Dependencias
<ul>
  <li>NPM: https://nodejs.org</li>
  <li>Truffle: https://github.com/trufflesuite/truffle</li>
  <li>Ganache: http://truffleframework.com/ganache/</li>
  <li>Metamask: https://metamask.io/</li>
</ul>  

Para poder correr el proyecto es necesario seguir los siguientes pasos:

### Clonar el proyecto o descargar el zip
`git clone URL`

### Instalar las dependencias
```
$ cd TP2
$ npm install
```
### Instalar Ganache
https://trufflesuite.com/ganache/

### Iniciar Ganache
Abrir la red de ganache, esta creará una instancia de Blockchain.

### Compilar el programa
`$ truffle migrate --reset`
Importante: Es necesario migrar los contratos cada vez que se reinicia Ganache.

### Configuración Metamask
- Desbloquea Metamask
- Conecta Metamask a tu red local de Ethereum
- Importa una cuenta de las que te aparecen en Ganache

### Desplegar la pestaña FrontEnd del sistema
`$ npm run dev`
Visitar el siguiente URL para ingresar a la interfaz: http://localhost:3002
