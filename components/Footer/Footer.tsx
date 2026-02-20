import css from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={css.footer}>
            <div className={css.content}>
                <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
                <div className={css.wrap}>
                    <p>Developer: Oleksandra</p>
                    <p>
                        Contact me:
                        <a href="mailto:starovatovasasha@gmail.com"> starovatovasasha@gmail.com</a>
                    </p>
                </div>
            </div>
        </footer>

    )
}