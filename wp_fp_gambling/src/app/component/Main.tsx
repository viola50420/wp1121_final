import Image from 'next/image';
import styles from './Main.module.css'; // Import a CSS module for styling

export default function Main() {
  return (
    <>
      <div className={`p-11 ${styles.bounce}`} /> {/* Add bounce animation class */}
      <div className="hero pb-3"> {/* Add color change animation class */}
        <div className={`card bg-dark text-white border-0 mx-3 ${styles.noRotate}`}> {/* Add rotate animation class */}
          <Image
            src="/assets/gamble(1).jpg"
            alt="Card"
            height={500}
            width={750}
            className="card-img img-fluid"
          />
          <div className={`card-img-overlay d-flex align-items-center gap-100 bg-opacity-70 bg-gray-900 ${styles.fadeIn}`}>
            <div className="py-100" />
            <div className="container ">
              <p className={`card-title fs-1 text-4xl ${styles.jump}`}>
                Predict the Unpredictable
              </p>
              <p className={`card-text fs-5 d-none d-sm-block text-xl fw-lighter ${styles.colorFlash}`}>
                Bet on the Future: Weather, Stocks, Games - Where Thrills Meet
                Forecast !
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
