import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

export default function CopyBtn({
    btnText = 'Copy',
    copyText,
    styles = {},
    svg,
    setCopyBtnDisabled,
    copyBtnDisabled,
}) {

    async function handleCopyBtn() {
        try {
            setCopyBtnDisabled(true);
            await navigator.clipboard.writeText(copyText.toString());
            toast.success('text-copied', {
                position: 'bottom-right',
                theme: 'dark',
                autoClose: 1700,
                onClose: () => setCopyBtnDisabled(false),
            });
        } catch {
            setCopyBtnDisabled(true);
            toast.warn('text-not-copied', {
                position: 'bottom-right',
                theme: 'dark',
                autoClose: 2400,
                onClose: () => setCopyBtnDisabled(false),
            })
        }
    }

    const style = {
        btn: { color: 'white', backgroundColor: `${copyBtnDisabled ? '#4446a6' : '#6366f1'}`, height: '40px', width: '120px', borderRadius: '10px', }
    }

    return (
        <button
            disabled={copyBtnDisabled}
            onClick={handleCopyBtn}
            style={{ ...style.btn, ...styles, }}
        >
            {btnText}
            {svg && (
                <svg
                    style={{ display: 'inline', position: 'relative', left: '10px' }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24"
                    strokeWidth={1.5} stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                    /></svg>
            )}
        </button>
    );
}

CopyBtn.propTypes = {
    btnText: PropTypes.string,
    copyText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    styles: PropTypes.object,
    svg: PropTypes.bool,
    setCopyBtnDisabled: PropTypes.func,
    copyBtnDisabled: PropTypes.bool,
};