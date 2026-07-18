import { cookies } from 'next/headers';

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('saepace-session');
    
    if (!session) return null;
    
    return JSON.parse(session.value); // returns { email: "john@gmail.com" }
  } catch (e) {
    return null;
  }
}
