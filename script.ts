interface Veiculo {
   nome: string;
   placa: string;
   entrada: Date | string;
}


(function() {

   const $ =(query: string): HTMLInputElement | null => document.querySelector(query)

   function calcTempo(mil: number) {
     const min = Math.floor(mil / 60000);
     const sec = Math.floor((mil % 60000) / 1000);

     return `${min}m e ${sec}s`;
   }

   function patio() {
      function ler(): Veiculo[] { // pro ler não retornar any
         return localStorage.patio ? JSON.parse(localStorage.patio) : [];
      }

      function salvar(veiculos: Veiculo[]) { 
        localStorage.setItem("patio", JSON.stringify(veiculos))
      }

      function adcicionar(veiculo: Veiculo, salva?: boolean) {
         const row = document.createElement("tr");

         row.innerHTML = `
          <td>${veiculo.nome}</td>
          <td>${veiculo.placa}</td>
          <td>${veiculo.entrada}</td>
          <td>
            <button class="delete" data-placa="${veiculo.placa}">x</button>
          </td>
         `;

         row.querySelector(".delete")?.addEventListener("click", function() {
            remover(this.dataset.placa)
         })

         $('#patio').appendChild(row)

         //todos os antigos que vem do ler ejunta com os novos
         if(salva) salvar([...ler(), veiculo])
      }

      function remover(placa: string) {
         //encontrar todos salvos 
         const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);

         const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

         if(!confirm(`O veiculo ${nome} permaneceu por tempo ${tempo}. Deseja encerrar ?`)) return 

         salvar(ler().filter(veiculo => veiculo.placa !== placa));
         render();
      } 

      function render() {
        $('#patio')!.innerHTML = "";//deixa vazio
        const patio = ler();

        //se passou de um valor
        if(patio.length) {
         patio.forEach((veiculo) => adcicionar(veiculo))
        }
      }

      return { ler, adcicionar, remover, salvar, render }
   }

   patio().render()
   $("#cadastrar")?.addEventListener("click", () => {
     const nome = $("#nome")?.value
     const placa = $("#placa")?.value

     if(!nome || !placa){
        alert("Os campos nome e placa são obrigatórios");
        return
     }
   
   patio().adcicionar({nome, placa, entrada: new Date().toDateString() },true)
   })
})();