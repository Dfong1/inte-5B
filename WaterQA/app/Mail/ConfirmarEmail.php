<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ConfirmarEmail extends Mailable
{
    use Queueable, SerializesModels;
    public $url;
    public$name;

    public function __construct($url, $name)
    {
        $this->url = $url;
        $this->name = $name;
        $this->subject('Activa tu cuenta');
    }
    public function envelope()
    {
        return new Envelope(
            subject: 'Confirmar Email',
        );
    }
    public function content()
    {
        return new Content(
            view: 'email_confirmation',
        );
    }

    public function attachments()
    {
        return [];
    }
}
