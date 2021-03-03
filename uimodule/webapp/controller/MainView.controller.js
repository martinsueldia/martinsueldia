/* eslint-disable no-unused-vars */
sap.ui.define([
  "profertil/appCtaCorriente/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/ui/core/library"

], function (Controller, JSONModel, MessageToast, CoreLibrary) {
  "use strict";

  var ValueState = CoreLibrary.ValueState;

  return Controller.extend("profertil.appCtaCorriente.controller.MainView", {
    onInit: function () {

      //Variables locales
      var fechaActual,
          that = this,
          cliente,
          fechaAc;


      //Models
      var oModel = "",
        oModelEstadoGral = new JSONModel(),
        oModelFecAct = new JSONModel();

      //Obtener la fecha del servidor
      oModelFecAct = that.getView().getModel("ModelFecAc"); //Modelo Json vacio creado en manifest
      fechaActual = new Date();
      fechaAc = {
       fechaActual: fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear()
      };

      ///oModelFecAct.setProperty("/ModelFecAc", fechaAc);

      //Obtener el valor del cliente si es Administrador
       cliente = "100606";

      //Obtener Odata
      oModel = this.getView().getModel();
      if (typeof oModel !== "undefined") {

        var readurl = "/cta_saldoSet?$filter=(Kunnr eq " + cliente + ")";
        oModel.read(readurl, {
          // filters: aFilters,
          success: function (oData, oResponse) {
            if (oResponse.statusCode === "200") {
              //Obtener Json Odata
              oModelEstadoGral = that.getView().getModel("ModelEstadoGral"); //Modelo Json vacio creado en manifest
              oData.results.forEach(function (oValue, j) {

                var estadoGral = {
                  TotalSaldoFin: oValue.TotalSaldoFin,      //Total
                  ASaldoCc: oValue.ASaldoCc,                //Saldo Compensación en Cuenta Corriente
                  FactVencidas: oValue.FactVencidas,        //Facturas Vencidas
                  FactAntVencidas: oValue.FactAntVencidas,  //A - Facturas Anticipada vencida
                  Pagos: oValue.Pagos,                      //Pagos
                  FactAVencer: oValue.FactAVencer,          //Facturas a vencer
                  FactAntAVencer: oValue.FactAntAVencer,    //B - Factura Anticipada a vencer
                  TotalSaldoCereal: oValue.TotalSaldoCereal, //Total Cereal
                  OpePFijar: oValue.OpePFijar,              //Cereal entregado pendiente de fijar
                  OpePFactu: oValue.OpePFactu,              //Cereal entregado pendiente de liquidar
                  OpePEntrega: oValue.OpePEntrega,          //Cereal liquidado pendiente de entrega
                  LineaAfectada: oValue.LineaAfectada,      //Linea Afectada
                  LineaAcordada: oValue.LineaAcordada,      //Linea Acordada
                  LineaDisponible: oValue.LineaDisponible,  //Total Disponible
                  TotalCupos: oValue.TotalCupos,            //CUPOS SOLICITADOS
                  AVencer: oValue.AVencer,                  //A vencer según fecha de negocio
                  Vencidos: oValue.Vencidos,                //Vencidos según fecha de negocio
                  TotalNegocio: oValue.TotalNegocio,        //TOTAL NEGOCIOS COMPROMETIDOS
                  TotalContratos: oValue.TotalContratos,    //Total Contratos
                  ICerAVenc: oValue.ICerAVenc,              //A vencer según fecha máxima de entrega
                  HCerVenc: oValue.HCerVenc,                //Vencido según fecha máxima de entrega
                  TotalCheques: oValue.TotalCheques,        //Total Cheques
                  GSaldoRd: oValue.GSaldoRd,                //CPD Pendiente de Acreditarse (Banco Galicia)
                  GSaldoRdRio: oValue.GSaldoRdRio,          //CPD Pendiente de Acreditarse (Banco Río)
                  FSaldoVencido: oValue.FSaldoVencido       //(Vencido) Saldo (-) a Favor / (+) Vencido
                };
                oModelEstadoGral.setProperty("/ModelEstadoGral", estadoGral);
              });
            }
          },
          error: function (oError) {
            console.error("error al obtener datos del odata");
          }
        });
      }
    },
    onPressDetCta: function (evt) {
      //Redireccionar a  la pagina de detalle
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("RouteDetCta");
      // MessageToast.show('Visualizar detalle direccionar a fragment');
    },
    onPressDetCheques: function (evt) {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("RouteDetCheques");
    },
    onPressDetCanje: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("RouteDetCanje");
    },
    onPressNegocio: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("RouteNegocio");
    },
    onPressBancoGalicia: function(){

    },
    onPressBancoRio: function(){

    },
    onExport: function () {
      console.log("exportar");
    },
    onSearch: function (event) {
      var oItem = event.getParameter("suggestionItem");
      if (oItem) {
        MessageToast.show("Search for: " + oItem.getText());
      } else {
        MessageToast.show("Search is fired!");
      }
    },
  });
});
