import { ROLE_GUIDE } from "../data/roles";
import { useAuth } from "../hooks/useAuth";

export default function RoleGuide() {
  const { user } = useAuth();
  const guide = ROLE_GUIDE[user?.role];
  if (!guide) return null;

  return (
    <aside className="role-guide">
      <strong>{guide.title}</strong>
      <p>{guide.summary}</p>
      <div className="role-guide__cols">
        <div>
          <span className="role-guide__label">Your actions</span>
          <ul>
            {guide.actions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className="role-guide__label">Not your job</span>
          <ul>
            {guide.notForYou.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
