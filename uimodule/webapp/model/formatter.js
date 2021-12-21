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
    },
    formatZuonr: (Zuonr) =>{
      if (Zuonr < Zuonr.length)
      {
        return "";
      }
      else
      {
        return Zuonr;
      }
    },
    formatDynamicSaldo: (Saldo) =>{
      if (Saldo > 0){
        return "Vencido USD " + Saldo;
      }
      else if (Saldo === null){
        return "";
      }
      else {
        return "a Favor USD " + Saldo;
      }
    },
    formatVisibilidad: (blart) =>{
      if (blart == "FZ" || blart == "DZ" || blart == "FR" || blart == "DG" || blart == "FV" || blart == "FA" || blart == "FH" || blart == "FS"
       || blart == "FK" || blart == "KF" || blart == "CC" || blart == "DC" || blart == "PU" || blart == "GF" || blart == "GC" || blart == "GD"
       || blart == "RC"
       || blart == "CL" ) {
        return true;
      }
      else {
        return false;
      }
    },
    formatActiveZuonr: (blart) =>{
      if (blart == "FZ" || blart == "DZ" || blart == "FR" || blart == "DG" || blart == "FV" || blart == "FA" || blart == "FH" || blart == "FS" || blart == "RC") {
        return true;
      }
      else {
        return false;
      }
    },
    formatIconoZuonr: (blart) =>{
      if (blart == "FZ" || blart == "DZ" || blart == "FR" || blart == "DG" || blart == "FV" || blart == "FA" || blart == "FH" || blart == "FS" || blart == "RC") {
        return "sap-icon://detail-view";
      }
      else {
        return "";
      }
    },
    usd: function (val1) {
      var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
              maxFractionDigits: 2,
              groupingEnabled: true,
              groupingSeparator: ".",
              decimalSeparator: ","
            });
            parseFloat(val1).toFixed(2);

            return oNumberFormat.format(val1);
        },
    tn: function (val1) {
            return parseFloat(val1).toFixed(2);
        },
    colorFechaVencimiento: function (fecha) {
            var hoy = new Date();
            if (fecha < hoy) {
                return sap.ui.core.ValueState.Error;
            }
            return sap.ui.core.ValueState.Success;
        },
     colorHighlight: function (fecha) {
            var hoy = new Date();
            if (fecha < hoy) {
                return sap.ui.core.MessageType.Error;
            }
            return sap.ui.core.MessageType.Success;
        }
  };
});
