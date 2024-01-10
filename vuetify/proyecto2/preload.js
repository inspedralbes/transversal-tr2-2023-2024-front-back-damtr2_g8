// preload.js

// Este código se ejecutará solo en el entorno del navegador
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
      const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
      }
    
      for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
      }
    })
  }
//   else{
//     console.log("no es navegador")
//   }