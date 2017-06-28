/*
 * CotizacionTest.java dannyds
 *
 * Copyright (c) 2014 CLETECI, C.A. All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * CLETECI, C.A. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with CLETECI.
 *
 * CLETECI MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE SUITABILITY OF
 * THE SOFTWARE, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE, OR NON-INFRINGEMENT. SUN SHALL NOT BE LIABLE FOR
 * ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR
 * DISTRIBUTING THIS SOFTWARE OR ITS DERIVATIVES.
 */
package com.atrioseguros.cotizacion.domain.model;

import static org.junit.Assert.*;

import java.util.Date;

import org.junit.Test;

/**
 * @author dannyds
 *
 */
public class CotizacionTest {

	@Test
	public void testCrearNuevaCotizacion() {
		Cotizacion cotizacion = new Cotizacion();
		Solicitante solicitante = new Solicitante("V", "15917854", "Pedro", "Peres", "M", new Date(), "Dtto. Capital", "Parque Central", "pedroperez@gmail.com");
		cotizacion.setVehiculo(new Vehiculo(2014, "Ford", "Fiesta", "Sincrónico"));
		cotizacion
				.setSolicitante(solicitante);
		
		solicitante.addTelefono(new Telefono("212", "6583364"));
		solicitante.addTelefono(new Telefono("412", "8125534"));
	}

}
