import './MainLayout.css';

const MainLayout = ({ children, activeTab, onTabChange, onCreateClick, onLogout }) => {
    return (
        <div className="app-container">
            <div className="main-content">
                <div className="sidebar">
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="sidebar-pill"></div>
                    </div>
                    <button
                        onClick={onLogout}
                        style={{
                            marginBottom: '20px',
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#ff5555'
                        }}
                        title="Logout"
                    >
                        &#x23FB; {/* Power icon */}
                    </button>
                </div>
                <div className="content-area">
                    <div className="top-bar">
                        <div className="tabs">
                            <div
                                className={`tab ${activeTab === 'task' ? 'active' : ''}`}
                                onClick={() => onTabChange('task')}
                            >
                                TASK
                            </div>
                            <div
                                className={`tab ${activeTab === 'schedule' ? 'active' : ''}`}
                                onClick={() => onTabChange('schedule')}
                            >
                                SCHEDULE
                            </div>
                        </div>
                        <button className="create-btn" onClick={onCreateClick}>CREATE</button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
