sap.ui.define([], function () {
	"use strict";
	return {
    saldoAcumulado: (Saldo) =>{
      if (Saldo === "Saldo Acumulado"){
        var texto = new sap.m.ObjectStatus({
          active: true,
          text: "{BlartTxt}",
        });
        return texto;
      }
      else {
          return Saldo;
      }
    }
  };
});
