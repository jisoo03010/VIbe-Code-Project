export function SettingsPage() {
  return (
    <div className="settings-page">
      <h2>설정</h2>
      <div className="settings-list">
        <div className="settings-item">
          <span>알림</span>
          <span className="settings-item__value">꺼짐</span>
        </div>
        <div className="settings-item">
          <span>테마</span>
          <span className="settings-item__value">라이트</span>
        </div>
        <div className="settings-item">
          <span>버전</span>
          <span className="settings-item__value">0.1.0</span>
        </div>
      </div>
    </div>
  );
}
