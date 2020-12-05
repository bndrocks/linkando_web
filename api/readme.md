<p align="center"><img src="https://laravel.com/assets/img/components/logo-laravel.svg"></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/d/total.svg" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/v/stable.svg" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/license.svg" alt="License"></a>
</p>

## Levantar projeto na sua máquina local:

Instalar o composer: https://getcomposer.org/download/ </br>
Navegar até a pasta /api e rodar os seguintes comandos pelo terminal:</br>
composer update</br>
editar o arquivo .env.example com as informações do banco de dados (</br>
DB_CONNECTION=mysql</br>
DB_HOST=127.0.0.1</br>
DB_PORT=3306</br>
DB_DATABASE=xxx</br>
DB_USERNAME=xxx</br>
DB_PASSWORD=xxx</br>
) e em seguida renomear para .env</br>
Feito isso rode:</br>
php artisan migrate</br>
php artisan jwt:secret</br>
php artisan serve</br>
Já estará rodando a api</br>

## License

The Laravel framework is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).
