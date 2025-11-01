<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

final class TestMailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mail:test {email? : The email address to send the test mail to}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test email to verify mail configuration';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = $this->argument('email') ?? 'test@example.com';

        $this->info('Sending test email to: ' . $email);

        try {
            Mail::raw('This is a test email from your Laravel application. If you can see this, your mail configuration is working correctly!', function ($message) use ($email) {
                $message->to($email)
                    ->subject('Test Email - Laravel Mail Configuration');
            });

            $this->info('Test email sent successfully!');
            $this->info('Check Inbucket at: https://' . env('MAIL_URL'));

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Failed to send test email: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}