# BCCB — prototipos de rediseño

Cuatro propuestas de rediseño para [bccb.es](https://www.bccb.es), con los textos, logotipos y protocolos
de la web actual. Sitio estático; se publica en GitHub Pages protegido con contraseña.

- `index.html` — página de entrada con las cuatro variantes
- `variant-1/` … `variant-4/` — Corporate Trust · Editorial · Premium Modern · Narrativa
- `shared/` — JS/CSS común (año dinámico, animaciones, menú móvil, selector de prototipo, formulario demo)
- `assets/` — imágenes usadas por los prototipos

## Ver en local

```bash
python3 -m http.server 8765
# http://127.0.0.1:8765/
```

## Publicación (GitHub Pages con contraseña)

`build.sh` cifra cada página HTML con [StatiCrypt](https://github.com/robinmoisson/staticrypt) usando la
variable `PROTOTYPES_PASSWORD`. En GitHub Actions esa variable viene del secreto del repositorio:

```bash
gh secret set PROTOTYPES_PASSWORD -R <owner>/<repo>   # se pide la contraseña por teclado
```

Cada push a `main` (o "Run workflow") vuelve a construir y desplegar. Para probar el build en local:

```bash
PROTOTYPES_PASSWORD='...' ./build.sh dist && python3 -m http.server 8766 -d dist
```

Los formularios son de demostración y no envían datos.
