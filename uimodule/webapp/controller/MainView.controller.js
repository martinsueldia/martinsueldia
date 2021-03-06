/* eslint-disable no-unused-vars */
sap.ui.define([
  "profertil/appCtaCorriente/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/ui/core/library",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Fragment",
  "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, CoreLibrary, Filter, FilterOperator, Fragment, MessageBox) {
  "use strict";

  var ValueState = CoreLibrary.ValueState;
  var oController;
  var rebindTheTable;
  var contador = 0;
  return Controller.extend("profertil.appCtaCorriente.controller.MainView", {
    onInit: function () {
      oController = this;
      if (!this.getOwnerComponent().getModel("oModelCliente")) {
        var oData = { Cliente: "", isAdmin: oController.validarAdmin()};
        var oModel1 = new sap.ui.model.json.JSONModel(oData);
        this.getOwnerComponent().setModel(oModel1, "oModelCliente");
      }
      //Variables locales
      var fechaActual,
        cliente,
        fechaAc;
      var oModelFecAct = new JSONModel(),
        fechaActual = new Date();
      fechaAc = {
        fechaActual: fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear()
      };

      oModelFecAct.setProperty("/ModelFecAc", fechaAc);
      this.getView().setModel(oModelFecAct, "ModelFecAc");

      //Obtener el valor del cliente si es Administrador
      if (this.validarAdmin() == false) {

        this.buscarDatos();
        //es admin,hacer visible el input
        this.getView().byId("Cliente").setVisible(false);
        this.getView().byId("_IDGenLabel1").setVisible(false);

      } else {
        this.getView().byId("Cliente").setVisible(true);
        this.getView().byId("_IDGenLabel1").setVisible(true);
        //MessageBox.information("Para Iniciar filtre por N° de Cliente");
      };
    },

    onCliente: function (oEvent) {
      var cliente = oEvent.getSource().getValue();
      this.buscarDatos(cliente);
    },

    validarAdmin: function () {
      //return true;
      return window.location.href.toLowerCase().includes("-admin");
    },

    buscarDatos(cliente) {
      //Indicador de Carga
      sap.ui.core.BusyIndicator.show(0);
      //Variables locales
      var fechaActual,
        that = this,
        cliente,
        fechaAc;
      var oModel = "",
        oModelEstadoGral = new JSONModel();
      this.getOwnerComponent().getModel("oModelCliente").setProperty("/Cliente", cliente);
      oModel = this.getView().getModel();
      if (typeof oModel !== "undefined") {
        var readurl = "/cta_saldoSet";

        var aFilters = [];
        var estadoGral = {
          Kunnr: 0,
          KunnrName1: 0,
          TotalSaldoFin: 0,
          ASaldoCc: 0,
          FactVencidas: 0,
          FactAntVencidas: 0,
          Pagos: 0,
          FactAVencer: 0,
          FactAntAVencer: 0,
          TotalSaldoCereal: 0,
          OpePFijar: 0,
          OpePFactu: 0,
          OpePEntrega: 0,
          LineaAfectada: 0,
          LineaAcordada: 0,
          LineaDisponible: 0,
          TotalCupos: 0,
          AVencer: 0,
          Vencidos: 0,
          TotalNegocio: 0,
          TotalContratos: 0,
          ICerAVenc: 0,
          HCerVenc: 0,
          TotalCheques: 0,
          GSaldoRd: 0,
          GSaldoRdRio: 0,
          FSaldoVencido: 0,
          PosFinProy: 0,
          rebind: false
        };
        if (oController.validarAdmin()){
          sap._sesionProfertil = { cliente: cliente };
          var o = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function () {
              var r = o.apply(this, arguments);
              if (arguments[1].indexOf("sap/opu/odata/sap/") > 0) {
                  this.setRequestHeader("from", sap._sesionProfertil.cliente);
              }
            return r;
          };
        }
        aFilters.push(new Filter("Kunnr", FilterOperator.EQ, cliente));

        oModel.read(readurl, {
          filters: aFilters,
          // eslint-disable-next-line no-shadow
          success: function (oData, oResponse) {
            if (oResponse.statusCode === "200") {
              //Obtener Json Odata

              oModelEstadoGral = that.getView().getModel("ModelEstadoGral"); //Modelo Json vacio creado en manifest
              oData.results.forEach(function (oValue, j) {

                estadoGral = {
                  Kunnr: oValue.Kunnr,                      // Numero de Cliente
                  KunnrName1: oValue.KunnrName1,            // Nombre de Cliente
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
                  FSaldoVencido: oValue.FSaldoVencido,      //(Vencido) Saldo (-) a Favor / (+) Vencido
                  PosFinProy: oValue.Pos_Fin_Proy,          // Posición Final Proyectada
                  rebind: true
                };
                oModelEstadoGral.setProperty("/ModelEstadoGral", estadoGral);
                sap.ui.core.BusyIndicator.hide();
              });
              oModelEstadoGral.setProperty("/ModelEstadoGral", estadoGral);
              sap.ui.core.BusyIndicator.hide();
            }
          },
          error: function (oError) {
            // eslint-disable-next-line no-console
            console.error("error al obtener datos del odata");
            sap.ui.core.BusyIndicator.hide();
          }
        });
      }
    },

    handleValueHelpCliente: function (oEvent) {
      if (!this._valueHelpCliente) {
        this._valueHelpCliente = sap.ui.xmlfragment("profertil.appCtaCorriente.fragments.BuscarCliente", this);
        this.getView().addDependent(this._valueHelpCliente);
      }
      this._valueHelpCliente.open();
    },

    _searchValueHelpCliente: function (oEvent) {

      var sValue = oEvent.getParameter("value");
      var oFilter = new sap.ui.model.Filter({
        path: "Kunnr",
        value1: sValue,
        operator: sap.ui.model.FilterOperator.Contains,
        caseSensitive: false
      });
      oEvent.getSource().getBinding("items").filter(oFilter);

    },

    onSearchCliente: function (oEvt) {
      // add filter for search
      var aFilters = [];
      var sQuery = oEvt.getSource().getValue();
      if (sQuery && sQuery.length > 0) {
        var filter = new Filter({
          filters: [
            new Filter("Cliente", sap.ui.model.FilterOperator.Contains, sQuery),
            new Filter({
              path: "ClienteTexto",
              caseSensitive: false,
              operator: sap.ui.model.FilterOperator.Contains,
              value1: sQuery
            })
          ],
          and: false
        });
        aFilters.push(filter);
      }

      // update list binding
      var list = sap.ui.getCore().byId("componenteId").getBinding("items");
      list.filter(aFilters);
    },

    _closeCliente: function (oEvent) {
      this._valueHelpCliente.close();
    },

    _closeValueHelpCliente: function (oEvent) {

      var oSelectedItem = oEvent.getSource().getProperty("title");
      if (oSelectedItem) {
        this.getOwnerComponent().getModel("oModelCliente").setProperty("/Cliente", oSelectedItem);
        this.buscarDatos(oSelectedItem);
      }
      this._valueHelpCliente.close();
    },

    onPressPagos: function (oEvent) {
      var oCrossAppNav = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
      // eslint-disable-next-line camelcase
      var href_display = null;
      // eslint-disable-next-line camelcase
      href_display = (oCrossAppNav && oCrossAppNav.hrefForExternal({
        target: {
          semanticObject: "informePagoNA",
          action: "display"
        },
      })) || "";
        var id = window.location.href.substring(window.location.href.indexOf("true&") + 5, window.location.href.lastIndexOf("&sap-startup"));
        var urlH = window.location.href.replace(id, "sap-ui-app-id=profertil.ReclamoPagos").split("#")[0] + href_display ;
        var url = urlH.replace("cp.portal/ui5appruntime.html", "site");
        sap.m.URLHelper.redirect(url, true);
    },

    onPressInterbanking: function (oEvent){
      var oCrossAppNav = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
      // eslint-disable-next-line camelcase
      var href_display = null;
      // eslint-disable-next-line camelcase
      href_display = (oCrossAppNav && oCrossAppNav.hrefForExternal({
        target: {
          semanticObject: "Interbanking",
          action: "display"
        },
      })) || "";
        var id = window.location.href.substring(window.location.href.indexOf("true&") + 5, window.location.href.lastIndexOf("&sap-startup"));
        var urlH = window.location.href.replace(id, "sap-ui-app-id=profertil.realizarPagos").split("#")[0] + href_display ;
        var url = urlH.replace("cp.portal/ui5appruntime.html", "site");
        sap.m.URLHelper.redirect(url, true);
    },


    onPressDetCta: function (evt) {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("RouteDetCta", true);
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
    onPressMercaderia: function () {
       var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteMercaderia");
    },
    onPressBancoRio: function () {

    },
    onExport: function () {
      // eslint-disable-next-line no-console
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
    onPressLineaAcre: function (){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("RouteLineaAcordada");
    },
  });
});
