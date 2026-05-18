<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Neon PostgreSQL SNI fix
        $host = config('database.connections.pgsql.host');
        $endpointId = explode('.', $host)[0]; // ep-silent-field-aojr6ph3-pooler
        
        config(['database.connections.pgsql.options' => [
            \PDO::ATTR_EMULATE_PREPARES => true,
        ]]);

        // Override DSN with endpoint option
        config(['database.connections.pgsql.host' => $host]);
        config(['database.connections.pgsql.dsn' => 
            "pgsql:host={$host};port=5432;dbname=neondb;sslmode=require;options=endpoint%3D{$endpointId}"
        ]);
    }
}
