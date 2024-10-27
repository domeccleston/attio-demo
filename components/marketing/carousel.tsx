import Image from "next/image";
import styles from "@/app/styles/carousel.module.css";

export function Carousel() {
  return (
    <div className="mt-16 mb-20">
      <p className="text-center text-lg text-gray-700 mb-14">
        Trusted in production by the best ML engineers in the world, from
        startups to Fortune 500s
      </p>
      <div className={styles.carouselContainer}>
        <div className={styles.carouselTrack}>
          <div className={styles.carouselSlide}>
            <Image
              alt="Company 1 logo"
              src="/amazon.svg"
              width={220}
              height={120}
            />
          </div>
          <div className={styles.carouselSlide}>
            <Image
              alt="Company 2 logo"
              src="/bmw.svg"
              width={220}
              height={120}
            />
          </div>
          <div className={styles.carouselSlide}>
            <Image
              alt="Company 3 logo"
              src="/google.svg"
              width={220}
              height={120}
            />
          </div>
          <div className={styles.carouselSlide}>
            <Image
              alt="Company 4 logo"
              src="/marriott.svg"
              width={220}
              height={120}
            />
          </div>
          <div className={styles.carouselSlide}>
            <Image
              alt="Company 5 logo"
              src="/salesforce.svg"
              width={220}
              height={120}
            />
          </div>
          <div className={styles.carouselSlide}>
            <Image
              alt="Company 1 logo"
              src="/shopify.svg"
              width={220}
              height={120}
            />
          </div>
          <div className={styles.carouselSlide}>
            <Image
              alt="Company 2 logo"
              src="/whatsapp.svg"
              width={220}
              height={120}
            />
          </div>
          <div className={styles.carouselSlide}>
            <Image
              alt="Company 3 logo"
              src="/zara.svg"
              width={220}
              height={120}
            />
          </div>
          <div className={styles.carouselSlide}>
            <Image
              alt="Company 1 logo"
              src="/amazon.svg"
              width={220}
              height={120}
            />
          </div>
          <div className={styles.carouselSlide}>
            <Image
              alt="Company 2 logo"
              src="/bmw.svg"
              width={220}
              height={120}
            />
          </div>
          <div className={styles.carouselSlide}>
            <Image
              alt="Company 3 logo"
              src="/google.svg"
              width={220}
              height={120}
            />
          </div>
          <div className={styles.carouselSlide}>
            <Image
              alt="Company 4 logo"
              src="/marriott.svg"
              width={220}
              height={120}
            />
          </div>
          <div className={styles.carouselSlide}>
            <Image
              alt="Company 5 logo"
              src="/salesforce.svg"
              width={220}
              height={120}
            />
          </div>
          <div className={styles.carouselSlide}>
            <Image
              alt="Company 1 logo"
              src="/shopify.svg"
              width={220}
              height={120}
            />
          </div>
          <div className={styles.carouselSlide}>
            <Image
              alt="Company 2 logo"
              src="/whatsapp.svg"
              width={220}
              height={120}
            />
          </div>
          <div className={styles.carouselSlide}>
            <Image
              alt="Company 3 logo"
              src="/zara.svg"
              width={220}
              height={120}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
