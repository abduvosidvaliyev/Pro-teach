import React from 'react';
import styles from './Tem.module.css';

function Templates() {
    return (
        <div className={styles.container}>
            <video autoPlay loop>
                <source src='bac.mp4' />
            </video>
            <div className={styles.category}>
                <button>Level 1</button>
                <button>Level 2</button>
                <button>Level 3</button>
            </div>
            <div className={styles.templates}>
                <iframe src="" frameBorder="0">
                    <html lang="en">
                    <head>
                        <meta charSet="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <title>Document</title>
                    </head>
                    <body>
                        
                    </body>
                    </html>
                </iframe>
                <div className={styles.box}></div>
                <div className={styles.box}></div>
                <div className={styles.box}></div>
                <div className={styles.box}></div>
                <div className={styles.box}></div>
                <div className={styles.box}></div>
                <div className={styles.box}></div>
                <div className={styles.box}></div>
                <div className={styles.box}></div>
                <div className={styles.box}></div>
                <div className={styles.box}></div>
                <div className={styles.box}></div>
            </div>
        </div>
    );
}

export default Templates;