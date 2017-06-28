/**
 * 
 */
package com.atrioseguros.ws.rs;

import java.util.Date;

import javax.ejb.Stateless;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.atrioseguros.cotizacion.domain.model.Cotizacion;
import com.atrioseguros.cotizacion.domain.model.Solicitante;
import com.atrioseguros.cotizacion.domain.model.Telefono;
import com.atrioseguros.cotizacion.domain.model.Vehiculo;

/**
 * @author dannyds
 * 
 */
@Path("/cotizaciones")
@Stateless
public class CotizacionResource {
	// private static final Logger logger =
	// LogManager.getLogger("UserResource");

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getCotizacion() {
		Cotizacion cotizacion = new Cotizacion();
		Solicitante solicitante = new Solicitante("V", "15917854", "Pedro", "Peres", "M", new Date(), "Dtto. Capital", "Parque Central", "pedroperez@gmail.com");
		cotizacion.setVehiculo(new Vehiculo(2014, "Ford", "Fiesta", "Sincrónico"));
		cotizacion.setSolicitante(solicitante);

		solicitante.addTelefono(new Telefono("212", "6583364"));
		solicitante.addTelefono(new Telefono("412", "8125534"));

		return Response.ok().entity(cotizacion).build();
	}

}
