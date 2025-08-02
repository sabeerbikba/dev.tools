import PropTypes from 'prop-types';
import ExternalLink from "@/common/ExternalLink";

const EndLink = ({
   text,
   link,
   linkText = 'here',
   linkStart,
   tailwindStyles,
}) => {

   const tailwind = {
      main: tailwindStyles,
      text: 'text-xl text-center text-white',
      link: 'text-[lightblue] underline',
   }
   return (
      <div className={tailwind.main}>
         <hr className="hr" />
         <p className={tailwind.text}>
            {linkStart && (
               <>
                  <ExternalLink
                     href={link}
                     className={tailwind.link}
                  >
                     {linkText}
                  </ExternalLink>{' '}
               </>
            )}
            {text}
            {!linkStart && (
               <>
                  {' '}<ExternalLink
                     href={link}
                     className={tailwind.link}
                  >
                     {linkText}
                  </ExternalLink>
               </>
            )}
         </p>
         <hr className="hr" />
      </div>
   )
}

EndLink.propTypes = {
   text: PropTypes.string.isRequired,
   link: PropTypes.string.isRequired,
   linkText: PropTypes.string,
   linkStart: PropTypes.bool,
   tailwindStyles: PropTypes.string,
}

export default EndLink;