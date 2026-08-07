import { LegalDocumentLayout, LegalSection } from "@/components/LegalDocumentLayout";

const ShippingPolicy = () => (
  <LegalDocumentLayout
    title="Política de envíos"
    updated="07-08-2026"
    canonicalPath="/envios"
    description="Información sobre producción, plazos, entrega y posibles incidencias de los productos impresos de Revelao.cam."
  >
    <LegalSection title="1. Servicios digitales">
      <p>Los eventos, galerías, códigos QR y archivos PDF descargables son servicios o contenidos digitales. Se entregan electrónicamente y no generan gastos de transporte.</p>
    </LegalSection>

    <LegalSection title="2. Productos impresos">
      <p>Esta política de envío solo se aplica cuando el cliente encarga a Revelao la impresión física de tarjetas, carteles u otros soportes. Antes de confirmar el pedido se informará del destino disponible, precio total, gastos de envío y plazo estimado.</p>
    </LegalSection>

    <LegalSection title="3. Producción y plazo de entrega">
      <p>El plazo comienza después de confirmar el diseño, recibir los datos necesarios y completar el pago. La fecha estimada dependerá del producto, cantidad, personalización y dirección de entrega, y se comunicará antes de aceptar el pedido.</p>
      <p>Salvo que se acuerde otro plazo, la entrega se realizará sin demora indebida y dentro del límite legal aplicable.</p>
    </LegalSection>

    <LegalSection title="4. Dirección y seguimiento">
      <p>El cliente debe revisar que la dirección facilitada sea completa y correcta. Cuando el transportista ofrezca seguimiento, Revelao enviará el enlace o código correspondiente.</p>
    </LegalSection>

    <LegalSection title="5. Incidencias de transporte">
      <p>Si el paquete llega dañado, incompleto o con un producto distinto al aprobado, contacta cuanto antes en <a className="font-medium text-foreground underline" href="mailto:revelao.cam@gmail.com">revelao.cam@gmail.com</a> con el número de pedido y fotografías del embalaje y del producto.</p>
      <p>Comunicarlo pronto facilita la gestión con el transportista, pero no limita los derechos legales que correspondan al consumidor.</p>
    </LegalSection>

    <LegalSection title="6. Retrasos o imposibilidad de entrega">
      <p>Si se produce un retraso relevante, informaremos al cliente y ofreceremos las opciones que correspondan. Si la entrega no puede realizarse por una dirección incorrecta o ausencia reiterada, podrán comunicarse los costes de un nuevo envío antes de tramitarlo.</p>
    </LegalSection>
  </LegalDocumentLayout>
);

export default ShippingPolicy;
