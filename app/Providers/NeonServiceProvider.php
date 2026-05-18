<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Connectors\PostgresConnector;

class NeonServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind('db.connector.pgsql', function () {
            return new class extends PostgresConnector {
                public function connect(array $config)
                {
                    $host = $config['host'];
                    $endpointId = explode('.', $host)[0];
                    $dsn = "pgsql:host={$host};port={$config['port']};dbname={$config['database']};sslmode=require;options='endpoint={$endpointId}'";
                    
                    $connection = $this->createConnection(
                        $dsn,
                        $config,
                        $this->getOptions($config)
                    );
                    
                    return $connection;
                }
            };
        });
    }
}