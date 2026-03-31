import React from 'react';
import { UI_THEMES } from '../utils/themes';

const ThemePreviewCard = ({ themeId, selected, onSelect, onHover, onLeave }) => {
    const theme = UI_THEMES.find(t => t.id === themeId);
    if (!theme) return null;

    const p = theme.previewColors;
    const vars = theme.variables;

    const radius = vars['--theme-radius'] || '8px';
    const cardRadius = vars['--theme-card-radius'] || '10px';
    const btnRadius = vars['--theme-btn-radius'] || '8px';
    const fontFamily = vars['--theme-font'] || 'system-ui, sans-serif';

    return (
        <div
            onClick={() => onSelect(themeId)}
            onMouseEnter={() => onHover && onHover(themeId)}
            onMouseLeave={() => onLeave && onLeave()}
            style={{
                cursor: 'pointer',
                borderRadius: '14px',
                border: selected
                    ? `2.5px solid ${p.accent}`
                    : '2px solid #e5e7eb',
                boxShadow: selected
                    ? `0 0 0 4px ${p.accent}22, 0 8px 32px ${p.accent}22`
                    : '0 2px 8px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                transition: 'all 0.22s cubic-bezier(.4,0,.2,1)',
                transform: selected ? 'translateY(-3px)' : 'none',
                background: '#fff',
                width: '100%',
                userSelect: 'none',
            }}
        >
            <div style={{
                background: '#f3f4f6',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                borderBottom: '1px solid #e5e7eb'
            }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fc5c65', display: 'inline-block' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fed330', display: 'inline-block' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2bcbba', display: 'inline-block' }} />
                <div style={{
                    flex: 1,
                    marginLeft: 6,
                    height: 10,
                    borderRadius: 4,
                    background: '#e5e7eb',
                }} />
            </div>

            <div style={{
                background: p.header,
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <div style={{
                    width: 40, height: 8, borderRadius: 3,
                    background: 'rgba(255,255,255,0.7)'
                }} />
                <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{
                            width: 20, height: 6, borderRadius: 3,
                            background: 'rgba(255,255,255,0.5)'
                        }} />
                    ))}
                </div>
            </div>

            <div style={{
                background: p.bg,
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontFamily: fontFamily,
            }}>
                <div style={{
                    background: `linear-gradient(90deg, ${p.accent}22 0%, ${p.bg} 100%)`,
                    borderRadius: radius,
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ width: '70%', height: 7, borderRadius: 3, background: p.text, opacity: 0.7, marginBottom: 5 }} />
                        <div style={{ width: '45%', height: 5, borderRadius: 3, background: p.text, opacity: 0.35 }} />
                    </div>
                    <div style={{
                        background: p.accent,
                        color: '#fff',
                        fontSize: 7,
                        fontWeight: 700,
                        borderRadius: btnRadius,
                        padding: '3px 8px',
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.02em',
                    }}>
                        Tìm hiểu
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                    {[0, 1].map(i => (
                        <div key={i} style={{
                            flex: 1,
                            background: p.card,
                            borderRadius: cardRadius,
                            padding: '7px',
                            boxShadow: `0 1px 4px ${p.accent}18`,
                        }}>
                            <div style={{
                                width: '100%', height: 30,
                                borderRadius: Number(cardRadius.replace('px', '')) - 2 + 'px',
                                background: `${p.accent}18`,
                                marginBottom: 5
                            }} />
                            <div style={{ width: '80%', height: 5, borderRadius: 2, background: p.text, opacity: 0.6, marginBottom: 3 }} />
                            <div style={{ width: '55%', height: 4, borderRadius: 2, background: p.text, opacity: 0.3 }} />
                        </div>
                    ))}
                </div>

                <div style={{
                    background: vars['--theme-footer-bg'] || '#1a1a2e',
                    borderRadius: `0 0 ${radius} ${radius}`,
                    padding: '5px 8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div style={{ width: 30, height: 5, borderRadius: 2, background: 'rgba(255,255,255,0.4)' }} />
                    <div style={{ width: 40, height: 5, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
                </div>
            </div>

            <div style={{
                padding: '10px 14px 12px',
                background: '#fff',
                borderTop: `2px solid ${p.accent}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <div>
                    <div style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: p.text,
                        fontFamily: fontFamily,
                        lineHeight: 1.3,
                    }}>
                        {theme.labelVn}
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                        {theme.description}
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: theme.tagColor,
                        background: `${theme.tagColor}18`,
                        padding: '2px 7px',
                        borderRadius: 20,
                        letterSpacing: '0.02em',
                    }}>
                        {theme.tag}
                    </span>
                    {selected && (
                        <span style={{
                            fontSize: 13,
                            color: p.accent,
                            fontWeight: 700,
                        }}>✓ Đang dùng</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ThemePreviewCard;
