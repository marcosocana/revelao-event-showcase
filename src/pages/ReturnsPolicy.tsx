import { LegalDocumentLayout, LegalSection } from "@/components/LegalDocumentLayout";

const ReturnsPolicy = () => (
  <LegalDocumentLayout
    title="Política de devoluciones"
    updated="07-08-2026"
    canonicalPath="/devoluciones"
    description="Consulta las condiciones de desistimiento, cancelación y devolución para servicios digitales y productos impresos de Revelao."
  >
    <LegalSection title="1. Ámbito de aplicación">
      <p>Esta política se aplica a los servicios digitales de Revelao y, cuando se contraten, a los productos impresos personalizados. Los derechos legales de consumidores y usuarios prevalecen sobre cualquier condición de esta página.</p>
    </LegalSection>

    <LegalSection title="2. Derecho de desistimiento">
      <p>Cuando resulte aplicable, el consumidor dispone de 14 días naturales para comunicar su decisión de desistir sin necesidad de justificarla.</p>
      <p>Si el usuario solicita expresamente que un servicio comience durante ese plazo, podrán aplicarse las consecuencias previstas legalmente por la parte ya ejecutada. La pérdida del derecho de desistimiento solo se producirá cuando concurran el consentimiento, la información y el resto de requisitos exigidos por la normativa.</p>
    </LegalSection>

    <LegalSection title="3. Servicios y contenidos digitales">
      <p>La activación de un evento, la generación de su QR y el acceso a las funciones contratadas constituyen la prestación del servicio digital. Si el servicio no funciona conforme a lo contratado, el usuario podrá solicitar su puesta en conformidad, una reducción del precio o la resolución del contrato en los casos previstos legalmente.</p>
    </LegalSection>

    <LegalSection title="4. Productos impresos personalizados">
      <p>Las tarjetas, carteles u otros productos creados con nombres, fechas, códigos QR, colores o diseños elegidos por el cliente son productos personalizados. Una vez iniciada su producción, pueden quedar excluidos del desistimiento por cambio de opinión.</p>
      <p>Esta exclusión no afecta a los derechos del cliente si el producto llega dañado, contiene un error imputable a Revelao o no coincide con el diseño aprobado.</p>
    </LegalSection>

    <LegalSection title="5. Cancelaciones antes de producir">
      <p>Si un pedido de impresión todavía no ha entrado en producción, podrá solicitarse su cancelación. Confirmaremos por escrito si la producción había comenzado y, cuando proceda, realizaremos el reembolso correspondiente.</p>
    </LegalSection>

    <LegalSection title="6. Cómo solicitar una devolución">
      <p>Escribe a <a className="font-medium text-foreground underline" href="mailto:revelao.cam@gmail.com">revelao.cam@gmail.com</a> indicando el correo utilizado en la compra, el identificador del pedido y el motivo de la solicitud. En productos dañados o incorrectos, adjunta fotografías que permitan revisar la incidencia.</p>
    </LegalSection>

    <LegalSection title="7. Reembolsos">
      <p>Cuando corresponda un reembolso, se efectuará sin demora indebida y mediante el mismo medio de pago utilizado, salvo acuerdo expreso distinto. Los plazos bancarios pueden variar según la entidad emisora.</p>
    </LegalSection>
  </LegalDocumentLayout>
);

export default ReturnsPolicy;
