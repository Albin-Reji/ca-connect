/**
 * Card.jsx — Reusable card container with hover effect
 */

export default function Card({ children, hover = false, style: extra = {}, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                background: '#fff',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid rgba(12,27,51,0.06)',
                padding: '28px',
                transition: 'all var(--transition)',
                cursor: onClick ? 'pointer' : 'default',
                ...extra,
            }}
            onMouseOver={(e) => {
                if (hover || onClick) {
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }
            }}
            onMouseOut={(e) => {
                if (hover || onClick) {
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.transform = '';
                }
            }}
        >
            {children}
        </div>
    );
}