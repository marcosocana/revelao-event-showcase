import qr1 from "@/assets/pruebas/qr1.png";
import qr2 from "@/assets/pruebas/qr2.png";
import qr3 from "@/assets/pruebas/qr3.png";
import qr4 from "@/assets/pruebas/qr4.png";
import phoneScreen from "@/assets/pruebas/phonescreen.png";

const PruebasLanding = () => {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center overflow-hidden px-6 py-16">
        <div className="relative flex w-full items-center justify-center">
          <div className="relative z-10 w-fit overflow-visible">
            <div className="relative overflow-hidden rounded-[38px] border border-white/10 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
              <img
                src={phoneScreen}
                alt="Vista previa Revelao"
                className="block h-auto w-[280px] sm:w-[340px] md:w-[420px]"
              />
            </div>

            <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-visible">
              <div className="absolute" style={{ left: "-42%", top: "70%" }}>
                <div className="qr-float qr-float-a">
                  <img
                    src={qr1}
                    alt="QR flotante 1"
                    className="qr-zoom block w-[62%] rounded-[18%] bg-white shadow-[0_22px_50px_rgba(0,0,0,0.55)]"
                  />
                </div>
              </div>

              <div className="absolute" style={{ right: "18%", top: "66%" }}>
                <div className="qr-float qr-float-b">
                  <img
                    src={qr2}
                    alt="QR flotante 2"
                    className="qr-zoom block w-[22%] rounded-[18%] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                  />
                </div>
              </div>

              <div className="absolute" style={{ left: "-6%", top: "6%" }}>
                <div className="qr-float qr-float-c">
                  <img
                    src={qr3}
                    alt="QR flotante 3"
                    className="qr-zoom block w-[30%] rounded-[18%] bg-white shadow-[0_22px_50px_rgba(0,0,0,0.5)]"
                  />
                </div>
              </div>

              <div className="absolute" style={{ left: "10%", top: "9%" }}>
                <div className="qr-float qr-float-d">
                  <img
                    src={qr4}
                    alt="QR flotante 4"
                    className="qr-zoom block w-[28%] rounded-[18%] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PruebasLanding;
