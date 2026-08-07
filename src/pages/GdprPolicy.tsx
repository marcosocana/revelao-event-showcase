import { LegalDocumentLayout, LegalSection } from "@/components/LegalDocumentLayout";

const GdprPolicy = () => (
  <LegalDocumentLayout title="Información RGPD" updated="07-08-2026">
    <LegalSection title="1. Quién trata los datos">
      <p>Revelao trata los datos de cuenta, contratación, facturación, soporte y navegación como responsable del tratamiento. Para consultas o ejercicio de derechos puede utilizarse <a className="font-medium text-foreground underline" href="mailto:revelao.cam@gmail.com">revelao.cam@gmail.com</a>.</p>
      <p>Respecto del contenido que los invitados suben a una galería, el organizador determina la finalidad, participantes y acceso al evento. Revelao presta la infraestructura tecnológica y puede actuar como encargado del tratamiento en los términos acordados con el organizador.</p>
    </LegalSection>

    <LegalSection title="2. Datos que pueden tratarse">
      <ul className="list-disc space-y-2 pl-5">
        <li>Datos de cuenta y contacto, como nombre y correo electrónico.</li>
        <li>Datos de contratación, pago y facturación.</li>
        <li>Información técnica y de seguridad necesaria para prestar el servicio.</li>
        <li>Fotos, vídeos, mensajes de audio y demás contenido aportado al evento.</li>
        <li>Consultas enviadas al servicio de soporte.</li>
      </ul>
    </LegalSection>

    <LegalSection title="3. Finalidades y bases jurídicas">
      <p>Los datos se utilizan para crear y gestionar eventos, prestar las funciones contratadas, atender consultas, mantener la seguridad, cumplir obligaciones legales y, solo cuando corresponda, enviar comunicaciones consentidas.</p>
      <p>Las bases jurídicas pueden ser la ejecución del contrato, el consentimiento, el cumplimiento de obligaciones legales y el interés legítimo en proteger y mejorar el servicio, previa ponderación cuando sea necesaria.</p>
    </LegalSection>

    <LegalSection title="4. Conservación">
      <p>Los contenidos del evento se conservan durante el periodo incluido en el plan contratado o durante el plazo informado al crear el evento. Los datos de facturación se mantienen durante los periodos exigidos por la normativa. Las consultas y datos de cuenta se conservarán mientras sean necesarios para la finalidad correspondiente y para atender posibles responsabilidades.</p>
    </LegalSection>

    <LegalSection title="5. Proveedores y transferencias">
      <p>Revelao puede utilizar proveedores de alojamiento, almacenamiento, correo, pagos, soporte o analítica que acceden únicamente a los datos necesarios para prestar sus servicios. Cuando exista una transferencia internacional, se aplicarán las garantías exigidas por el RGPD, como decisiones de adecuación o cláusulas contractuales tipo.</p>
    </LegalSection>

    <LegalSection title="6. Derechos de las personas">
      <p>Puede solicitar acceso, rectificación, supresión, oposición, limitación y portabilidad, así como retirar un consentimiento sin afectar a la licitud del tratamiento anterior. Para ejercerlos, escriba a <a className="font-medium text-foreground underline" href="mailto:revelao.cam@gmail.com">revelao.cam@gmail.com</a> e indique el derecho que desea ejercer.</p>
      <p>También puede presentar una reclamación ante la Agencia Española de Protección de Datos en <a className="font-medium text-foreground underline" href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">aepd.es</a>.</p>
    </LegalSection>

    <LegalSection title="7. Decisiones automatizadas y seguridad">
      <p>No se adoptan decisiones con efectos jurídicos basadas únicamente en tratamientos automatizados. Revelao aplica medidas técnicas y organizativas orientadas a proteger los datos frente a pérdida, alteración o acceso no autorizado.</p>
    </LegalSection>
  </LegalDocumentLayout>
);

export default GdprPolicy;
