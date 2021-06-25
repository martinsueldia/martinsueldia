sap.ui.define([
  "profertil/appCtaCorriente/controller/BaseController",
  "sap/ui/core/routing/History",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/format/DateFormat"
], function (Controller, History, Filter, FilterOperator, MessageToast, JSONModel) {
  "use strict";
  var oController;
  var saldoAcumulado;
  var fechaSaldo;
  return Controller.extend("profertil.appCtaCorriente.controller.DetalleCtaCorriente", {
    onInit: function () {
      var oViewModel;
      saldoAcumulado = false;
      oController = this;
      oController.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oController.oRouter.attachRouteMatched(oController._onRouteMatched, oController);

      oViewModel = new JSONModel({
        showBotonSaldo: false,
      });
      this.setModel(oViewModel, "ctaView");
    },

    _onRouteMatched: function () {
      this.getView().byId("detalleCtaCorrTabla").rebindTable();
    },

    onSaldo: function (oEvent) {
      var movDesde = this.getView().byId("FechaDesdeID").getDateValue();
      if (oEvent.getSource().getPressed()) {
        fechaSaldo = this._manipulateDate(movDesde, 1, "sub");
        saldoAcumulado = true;
        this.getView().byId("detalleCtaCorrTabla").rebindTable();
      }
      else {
        saldoAcumulado = false;
        this.getView().byId("detalleCtaCorrTabla").rebindTable();
      }
    },

    _manipulateDate: function (date, days, operation) {
      var dateOffset = (24 * 60 * 60 * 1000) * days;
      var myDate = new Date();
      if (operation === "sub") {
        myDate.setTime(date.getTime() - dateOffset);
      }
      else if (operation === "add") {
        myDate.setTime(date.getTime() + dateOffset);
      }
      return myDate;
    },

    onTableUpdateFinished: function () {
      var oTable = this.byId("_detalleCtaCorriente");
      var items = oTable.getItems();
      var oItem = items[0].getCells();
      var Fila = oItem[3].mProperties;
      if (Fila.text === "Saldo Acumulado") {
        oController.getModel("ctaView").setProperty("/showBotonSaldo", true);
      }
      else {
        if (saldoAcumulado === false){
        oController.getModel("ctaView").setProperty("/showBotonSaldo", false);
        }
      }
    },

    onNavBack: function () {
      var sPreviousHash = History.getInstance().getPreviousHash();
      if (sPreviousHash !== undefined) {
        history.go(-1);
      } else {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteMainView", {}, true);
      }
    },

    onPdfDocumento: function (oEvent) {
      var oModel = this.getView().getModel("relatedDocs");
      var ruta = oModel.sServiceUrl;
      var oTabla = oEvent.getSource().getBindingContext().getObject();
      var Año = oTabla.Budat.getFullYear();
      if (oTabla.Blart === "RC"){
        var rutaRecibo = this.getView().getModel().sServiceUrl;
        // eslint-disable-next-line camelcase
        var lv_path = rutaRecibo + "/pdfRecibosSet('" + oTabla.Zuonr + Año + "')/$value";
        window.open(lv_path);
      }
      else {
      var blart = "REM";
      var sPath = `${ruta}/PrinterSet(TipoDoc='${blart}',Documento='${oTabla.Zuonr}')/$value`;

      var o = window.open(sPath, "_blank");
      if (o == null) {
        MessageToast.show("Ducumento no encontrado");
      }
    }
    },

    onPressComprobante: function (oEvent) {
      if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
        var oTabla = oEvent.getSource().getBindingContext().getObject();
        var blart = "REM";
        var sPath = `DocumentosRel-display?&/Documento/${blart},${oTabla.Zuonr}`;
        sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
          target: {
            shellHash: sPath
          }
        });
      }
    },

    onBeforeRebindTable: function (oEvent) {
      var oViewModel;
      var hoy = new Date();
      var date = this.getView().byId("DP1").getDateValue();
      var movDesde = this.getView().byId("FechaDesdeID");
      var movHasta = this.getView().byId("FechaHastaID");

      var fechaMovDesde = movDesde.getDateValue();
      var fechaMovHasta = movHasta.getDateValue();

      var cliente = this.getOwnerComponent().getModel("oModelCliente").getData().Cliente;
      var oBindingParams = oEvent.getParameter("bindingParams");
      if (saldoAcumulado === false){
      if (date == null && fechaMovDesde == null && fechaMovHasta == null) {
        oBindingParams.filters.push(new Filter("FechaSaldo", FilterOperator.LE, hoy));
      }
      if (date) {
        oBindingParams.filters.push(new Filter("FechaSaldo", FilterOperator.LE, date));
      }
      if (fechaMovDesde) {
        oBindingParams.filters.push(new Filter("FechaMovDesde", FilterOperator.EQ, fechaMovDesde));
      }
      if (fechaMovHasta) {
        oBindingParams.filters.push(new Filter("FechaMovHasta", FilterOperator.EQ, fechaMovHasta));
      }
    }
    else
    {
      oBindingParams.filters.push(new Filter("FechaSaldo", FilterOperator.LE, fechaSaldo));
    }
      oBindingParams.filters.push(new Filter("Kunnr", FilterOperator.EQ, cliente));

    },

    handleChange: function () {
      this.getView().byId("detalleCtaCorrTabla").rebindTable();
    },

    onChangeFechaSaldo: function () {
      this.getView().byId("detalleCtaCorrTabla").rebindTable();
    },

  });
});
