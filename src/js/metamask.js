import detectProvider from '../node_modules/@metamask/detect-provider';

    const connectButton = document.querySelector('#connectButton');

    connectButton.addEventListener('click', async () => {
      console.log("clicked")
        // Detectamos la instancia de MetaMask
      const provider = await detectProvider();
      
      // Si MetaMask está instalado y conectado, se mostrará una ventana emergente para que el usuario permita la conexión.
      if (provider) {
        // Conectamos a la red de Ethereum
        await provider.request({ method: 'eth_requestAccounts' });
        
        // Obtenemos la identidad del usuario de MetaMask
        const accounts = await provider.request({ method: 'eth_accounts' });
        
        // La identidad del usuario de MetaMask está en la primera posición del array de cuentas
        const userAccount = accounts[0];
        
        // Hacemos algo con la identidad del usuario, como enviarla al contrato inteligente para registrar su voto.
      } else {
        console.error('MetaMask not installed');
      }
    });
