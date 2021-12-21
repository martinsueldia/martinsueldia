sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter",
    "sap/m/MessageBox"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, formatter, MessageBox) {
        "use strict";
        var oController;

        return Controller.extend("profertil.appCtaCorriente.controller.DetalleMercaderia", {
            formatter: formatter,
            onInit: function () {
                var oModel = this.getOwnerComponent().getModel();
                this.getView().setModel(oModel);
                oController = this;
                oController.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oController.oRouter.attachRouteMatched(oController._onRouteMatched, oController);
            },

            _onRouteMatched: function () {
              this.byId("expContent").mObjectBindingInfos.MercaderiaPendiente.binding.refresh();
              var clienteA = this.getOwnerComponent().getModel("ModelEstadoGral").getData().ModelEstadoGral.Kunnr;
              if (clienteA != this.clienteB){
                this.clienteB = clienteA;
                this.leerTotales();
              }
            },

            navToFacturadaPagada: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("FacturadaPagada");
            },
            navToFacturadaNoPagada: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("FacturadaNoPagada");
            },
            navToNoFacturadaNoPagada: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("NoFacturadaNoPagada");
            },

            leerTotales: function () {


                var oJson = {
                    FacturadaPagada: {
                        Vencido: {
                            Usd: 0,
                            Tn: 0
                        },
                        NoVencido: {
                            Usd: 0,
                            Tn: 0
                        },
                        Total: {
                            Usd: 0,
                            Tn: 0
                        }
                    },
                    FacturadaNoPagada: {
                        Vencido: {
                            Usd: 0,
                            Tn: 0
                        },
                        NoVencido: {
                            Usd: 0,
                            Tn: 0
                        },
                        Total: {
                            Usd: 0,
                            Tn: 0
                        }
                    },
                    NoFacturadaNoPagada: {
                        Vencido: {
                            Usd: 0,
                            Tn: 0
                        },
                        NoVencido: {
                            Usd: 0,
                            Tn: 0
                        },
                        Total: {
                            Usd: 0,
                            Tn: 0
                        }
                    }
                };
                var oModelTotales = new sap.ui.model.json.JSONModel(oJson);

                this.getView().setModel(oModelTotales, "totales");
                var oModel = this.getView().getModel("MercaderiaPendiente");
                 oModel.read("/TotalesSet", {
                    success: function (oData) {
                        for (var line of oData.results) {
                            // eslint-disable-next-line default-case
                            switch (line.Concepto) {
                                case "FACT_COMP_NO_VENCIDO":
                                    oJson.FacturadaPagada.NoVencido.Usd += parseFloat(line.Usd);
                                    oJson.FacturadaPagada.NoVencido.Tn += parseFloat(line.Tn);
                                    oJson.FacturadaPagada.Total.Usd += parseFloat(line.Usd);
                                    oJson.FacturadaPagada.Total.Tn += parseFloat(line.Tn);
                                    break;
                                case "FACT_COMP_VENCIDO":
                                    oJson.FacturadaPagada.Vencido.Usd += parseFloat(line.Usd);
                                    oJson.FacturadaPagada.Vencido.Tn += parseFloat(line.Tn);
                                    oJson.FacturadaPagada.Total.Usd += parseFloat(line.Usd);
                                    oJson.FacturadaPagada.Total.Tn += parseFloat(line.Tn);
                                    break;
                                case "FACT_NO_COMP_NO_VENC":
                                    oJson.FacturadaNoPagada.NoVencido.Usd += parseFloat(line.Usd);
                                    oJson.FacturadaNoPagada.NoVencido.Tn += parseFloat(line.Tn);
                                    oJson.FacturadaNoPagada.Total.Usd += parseFloat(line.Usd);
                                    oJson.FacturadaNoPagada.Total.Tn += parseFloat(line.Tn);
                                    break;
                                case "FACT_NO_COMP_VENCIDO":
                                    oJson.FacturadaNoPagada.Vencido.Usd += parseFloat(line.Usd);
                                    oJson.FacturadaNoPagada.Vencido.Tn += parseFloat(line.Tn);
                                    oJson.FacturadaNoPagada.Total.Usd += parseFloat(line.Usd);
                                    oJson.FacturadaNoPagada.Total.Tn += parseFloat(line.Tn);
                                    break;
                                case "NO_FACT_NO_COMP_NO_V":
                                    oJson.NoFacturadaNoPagada.NoVencido.Usd += parseFloat(line.Usd);
                                    oJson.NoFacturadaNoPagada.NoVencido.Tn += parseFloat(line.Tn);
                                    oJson.NoFacturadaNoPagada.Total.Usd += parseFloat(line.Usd);
                                    oJson.NoFacturadaNoPagada.Total.Tn += parseFloat(line.Tn);
                                    break;
                                case "NO_FACT_NO_COMP_VENC":
                                    oJson.NoFacturadaNoPagada.Vencido.Usd += parseFloat(line.Usd);
                                    oJson.NoFacturadaNoPagada.Vencido.Tn += parseFloat(line.Tn);
                                    oJson.NoFacturadaNoPagada.Total.Usd += parseFloat(line.Usd);
                                    oJson.NoFacturadaNoPagada.Total.Tn += parseFloat(line.Tn);
                                    break;
                            }

                            this.getView().getModel("totales").setData(oJson);

                        }
                      // eslint-disable-next-line no-console
                      //console.log(oData);
                    }.bind(this),
                    error: function () {
                        MessageBox.error("Error al obtener los datos, intente nuevamente");
                    }
                });
            }
        });
    });
