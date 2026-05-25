import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: 'db.nunduvfduxtqkqvbdkop.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Roma100415$$.',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

try {
  const client = await pool.connect();
  console.log('✅ Conectado a PostgreSQL');

  // Create the trigger function
  const funcSql = `
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $func$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    NEW.phone
  );
  RETURN NEW;
END;
$func$;`;

  await client.query(funcSql);
  console.log('✅ Función handle_new_user creada');

  // Create the trigger
  await client.query(`
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  `);
  console.log('✅ Trigger on_auth_user_created creado');

  await client.end();
  console.log('✅ Setup completo');
} catch (err) {
  console.error('❌ Error:', err.message);
}
