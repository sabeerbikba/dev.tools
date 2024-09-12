import PropTypes from 'prop-types';

const OpenLinkBtn = ({
   url,
   btnText = 'Test',
   btnDisabled,
   newTab = true,
   style = {}
}) => {

   const styles = {
      color: 'white', height: '40px', width: '120px', borderRadius: '10px',
      backgroundColor: btnDisabled ? '#4446a6' : '#6366f1', ...style
   }

   const openLink = () => {
      if (url === undefined) return console.error('URL is required to open');

      if (newTab) {
         console.log('opening link: ', url);
         window.open(url, '_blank');
      } else {
         window.location.href = url;
      }
   }

   return (
      <button style={styles} onClick={openLink} disabled={btnDisabled}>{btnText}</button>
   );
};

OpenLinkBtn.propTypes = {
   url: PropTypes.string.isRequired,
   btnText: PropTypes.string,
   btnDisabled: PropTypes.bool,
   newTab: PropTypes.bool,
   styles: PropTypes.object,
}

export default OpenLinkBtn;
