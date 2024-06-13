export default function NotPage() {
   const styles = {
      main: { fontFamily: 'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"', color: 'white', height: '100vh', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
      h1: { display: 'inline-block', margin: '0 20px 0 0', padding: '0 23px 0 0', fontSize: '24px', fontWeight: 500, verticalAlign: 'top', lineHeight: '49px', borderRight: '1px solid grey' },
      h2: { fontSize: '14px', fontWeight: 400, lineHeight: '49px', margin: 0 },
   }

   return (
      <div className="w-full h-screen" style={styles.main}>
         <div>
            <h1 style={styles.h1}>
               404
            </h1>
            <div style={{ display: 'inline-block' }}>
               <h2 style={styles.h2}>This page could not be found.</h2>
            </div>
         </div>
      </div>
   );
};