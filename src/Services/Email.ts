import nodemailer from 'nodemailer';

class EmailService {
 transporter: nodemailer.Transporter
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user:process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD 
      }
    })
  }

  async sendActivationMail(to: string, link: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Активация аккаунта на ' + process.env.API_URL,
      text: '',
      html: 
          `
          <div>
            <h1>Для активации аккаунта перейдите по ссылке:</h1></br>
            <a href="${link}">${link}</a>
          </div>

          `
    })
  }
}

export default new EmailService()